/**
 * AppService — Core service for Example App.
 *
 * Provides CRUD operations and utility functions for Example Items.
 * Uses scope prefix helpers to avoid hardcoding field/table names.
 */
var APP_FIELD_PREFIX = 'x_snc_example_';
var APP_TABLE_PREFIX = 'x_snc_example_';
var FP = APP_FIELD_PREFIX;
var TP = APP_TABLE_PREFIX;

var AppService = Class.create();
AppService.prototype = {
    initialize: function() {},

    /**
     * Get all items ordered by creation date.
     * @returns {Array} Array of item objects
     */
    getAllItems: function() {
        var items = [];
        var gr = new GlideRecord(TP + 'item');
        gr.orderByDesc('sys_created_on');
        gr.query();
        while (gr.next()) {
            items.push({
                sys_id: gr.getUniqueValue(),
                name: gr.getValue(FP + 'name') || '',
                description: gr.getValue(FP + 'description') || '',
                category: gr.getValue(FP + 'category') || 'general',
                priority: parseInt(gr.getValue(FP + 'priority')) || 0,
            });
        }
        return items;
    },

    /**
     * Get record count for a table with optional query filter.
     * @param {string} tableName - Full table name
     * @param {string} [encodedQuery] - Optional encoded query string
     * @returns {number} Record count
     */
    getRecordCount: function(tableName, encodedQuery) {
        try {
            var ga = new GlideAggregate(tableName);
            ga.addAggregate('COUNT');
            if (encodedQuery) ga.addEncodedQuery(encodedQuery);
            ga.query();
            if (ga.next()) return parseInt(ga.getAggregate('COUNT'), 10) || 0;
        } catch (e) {
            gs.debug('AppService.getRecordCount error: ' + e);
        }
        return 0;
    },

    type: 'AppService'
};
