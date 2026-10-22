/**
 * AppService — validated, ACL-enforced CRUD for Example Items.
 *
 * Every query uses GlideRecordSecure, so the table ACLs apply to whoever calls the
 * REST API. Methods return { status, body }; send() writes that to a REST response.
 *
 * The function wrapper keeps the constants private: only AppService is declared in the
 * scope, so another Script Include's FP or MAX_NAME can never replace these values.
 */
var AppService = (function() {
    var FP = 'x_snc_example_';
    var ITEM_TABLE = FP + 'item';
    var CATEGORIES = ['general', 'important', 'urgent'];
    var MAX_NAME = 200;
    var MAX_DESCRIPTION = 4000;
    var DEFAULT_LIMIT = 50;
    var MAX_LIMIT = 100;
    var MAX_OFFSET = 100000;

    var AppService = Class.create();
    AppService.prototype = {
        initialize: function() {},

        /**
         * @param {Object} [queryParams] REST query params (values are arrays): limit (1-100), offset (0-100000)
         * @returns {{status: number, body: Array}} items, newest first; each says whether the caller may edit or delete it
         */
        listItems: function(queryParams) {
            var params = queryParams || {};
            var limit = this._clamp(this._firstInt(params.limit, DEFAULT_LIMIT), 1, MAX_LIMIT);
            var offset = this._clamp(this._firstInt(params.offset, 0), 0, MAX_OFFSET);
            var items = [];
            var gr = new GlideRecordSecure(ITEM_TABLE);
            gr.orderByDesc('sys_created_on');
            // Rows created in the same second need a fixed order, or offset pages could repeat or skip them.
            gr.orderByDesc('sys_id');
            gr.chooseWindow(offset, offset + limit);
            gr.query();
            while (gr.next()) {
                items.push(this._toItem(gr));
            }
            return this._result(200, items);
        },

        /**
         * @param {Object} data { name, description?, category?, priority? }
         * @returns {{status: number, body: Object}} 201 with the item, 400, or 403
         */
        createItem: function(data) {
            var error = this._validate(data, true);
            if (error) return this._error(400, error);
            var gr = new GlideRecordSecure(ITEM_TABLE);
            if (!gr.canCreate()) return this._error(403, 'Not allowed to create items');
            gr.initialize();
            this._apply(gr, data);
            if (!gr.insert()) return this._error(403, 'Item was not created');
            return this._result(201, this._toItem(gr));
        },

        /**
         * @param {string} sysId
         * @param {Object} data any of { name, description, category, priority }
         * @returns {{status: number, body: Object}} 200 with the item, 400, 403, or 404
         */
        updateItem: function(sysId, data) {
            var error = this._validate(data, false);
            if (error) return this._error(400, error);
            var gr = new GlideRecordSecure(ITEM_TABLE);
            if (!gr.get(sysId)) return this._error(404, 'Item not found');
            if (!gr.canWrite()) return this._error(403, 'Not allowed to update this item');
            this._apply(gr, data);
            if (!gr.update()) return this._error(403, 'Item was not updated');
            return this._result(200, this._toItem(gr));
        },

        /**
         * @param {string} sysId
         * @returns {{status: number, body: (Object|undefined)}} 204, 403, or 404
         */
        deleteItem: function(sysId) {
            var gr = new GlideRecordSecure(ITEM_TABLE);
            if (!gr.get(sysId)) return this._error(404, 'Item not found');
            if (!gr.canDelete()) return this._error(403, 'Not allowed to delete this item');
            if (!gr.deleteRecord()) return this._error(403, 'Item was not deleted');
            return this._result(204);
        },

        /** Reads a JSON request body; returns null when the body is missing or invalid. */
        readBody: function(request) {
            try {
                var data = request.body.data;
                return data && typeof data === 'object' ? data : null;
            } catch (e) {
                return null;
            }
        },

        /** Writes a { status, body } result to a Scripted REST response. */
        send: function(response, result) {
            response.setStatus(result.status);
            if (result.body !== undefined) response.setBody(result.body);
        },

        /** Returns an error message, or '' when the payload is valid. */
        _validate: function(data, isCreate) {
            if (!data || typeof data !== 'object') return 'Request body must be a JSON object';
            if (isCreate || this._has(data, 'name')) {
                if (typeof data.name !== 'string' || !data.name.trim()) return 'name is required';
                if (data.name.length > MAX_NAME) return 'name must be at most ' + MAX_NAME + ' characters';
            }
            if (this._has(data, 'description')) {
                if (typeof data.description !== 'string') return 'description must be a string';
                if (data.description.length > MAX_DESCRIPTION) {
                    return 'description must be at most ' + MAX_DESCRIPTION + ' characters';
                }
            }
            if (this._has(data, 'category') && CATEGORIES.indexOf(data.category) === -1) {
                return 'category must be one of: ' + CATEGORIES.join(', ');
            }
            if (this._has(data, 'priority') && data.priority !== null && !this._isPriority(data.priority)) {
                return 'priority must be an integer from 1 to 5';
            }
            return '';
        },

        /** Copies only the fields present in data; the before-insert rule fills an empty priority. */
        _apply: function(gr, data) {
            if (this._has(data, 'name')) gr.setValue(FP + 'name', data.name.trim());
            if (this._has(data, 'description')) gr.setValue(FP + 'description', data.description);
            if (this._has(data, 'category')) gr.setValue(FP + 'category', data.category);
            if (this._has(data, 'priority')) {
                gr.setValue(FP + 'priority', data.priority === null ? '' : Number(data.priority));
            }
        },

        _toItem: function(gr) {
            return {
                sys_id: gr.getUniqueValue(),
                name: gr.getValue(FP + 'name') || '',
                description: gr.getValue(FP + 'description') || '',
                category: gr.getValue(FP + 'category') || 'general',
                priority: parseInt(gr.getValue(FP + 'priority'), 10) || null,
                can_write: gr.canWrite(),
                can_delete: gr.canDelete(),
            };
        },

        /** Accepts 1-5 as a JSON number or a one-digit string; rejects true, [3], '0x3', ' 2 '. */
        _isPriority: function(value) {
            if (typeof value === 'number') return value % 1 === 0 && value >= 1 && value <= 5;
            return typeof value === 'string' && /^[1-5]$/.test(value);
        },

        _has: function(data, key) {
            return Object.prototype.hasOwnProperty.call(data, key);
        },

        _firstInt: function(values, fallback) {
            var raw = values && values.length ? values[0] : values;
            var parsed = parseInt(raw, 10);
            return isNaN(parsed) ? fallback : parsed;
        },

        _clamp: function(value, min, max) {
            return Math.min(Math.max(value, min), max);
        },

        _result: function(status, body) {
            return { status: status, body: body };
        },

        _error: function(status, message) {
            return this._result(status, { error: { message: message } });
        },

        type: 'AppService'
    };

    return AppService;
})();
