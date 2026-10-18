import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    app_service_si: {
                        table: 'sys_script_include'
                        id: '903af9c012024ebfb3fb473cf7d69cc9'
                    }
                    bom_json: {
                        table: 'sys_module'
                        id: 'f222d28208104a428061be968382dc94'
                    }
                    csp_glide_record_secure_get_value: {
                        table: 'sys_scope_privilege'
                        id: '51b1c09d6bd849e39eaf4ad8201eacaf'
                    }
                    csp_gliderecord_deleterecord: {
                        table: 'sys_scope_privilege'
                        id: 'dced7208ce9d4ed9b78707702d9f0b39'
                    }
                    csp_gliderecord_insert: {
                        table: 'sys_scope_privilege'
                        id: 'bf493e0c975743ba9ddde8a5d01a1a57'
                    }
                    csp_gliderecord_setvalue: {
                        table: 'sys_scope_privilege'
                        id: '5cde00497e7e409ab80d6d3fbf9fc66f'
                    }
                    csp_gliderecord_update: {
                        table: 'sys_scope_privilege'
                        id: 'fb988277a9a243c7b0e85ce8ff0d4413'
                    }
                    csp_restapirequest: {
                        table: 'sys_scope_privilege'
                        id: '2930e71f9142497791bc57155f8254b9'
                    }
                    csp_restapirequestbody: {
                        table: 'sys_scope_privilege'
                        id: '6bfcc8e59ca14486baf00c5b87c1e3eb'
                    }
                    csp_scriptableserviceresultbuilder_setbody: {
                        table: 'sys_scope_privilege'
                        id: '8bce0f640a1e47868273153bae305c8e'
                    }
                    csp_scriptableserviceresultbuilder_setstatus: {
                        table: 'sys_scope_privilege'
                        id: '1806c6e7fd9d410d92708e90087717b5'
                    }
                    default_priority_rule: {
                        table: 'sys_script'
                        id: 'c6f6cca89eff4030bdc515f5ce56f0dd'
                    }
                    example_api: {
                        table: 'sys_ws_definition'
                        id: '2f832b6ec1fc4585b76cd4d4104dccf0'
                    }
                    example_api_acl: {
                        table: 'sys_security_acl'
                        id: '084f95a87ade40079f5e5ca6046e3dda'
                    }
                    example_api_create: {
                        table: 'sys_ws_operation'
                        id: '09f6b49adca64fc9ae372b5a11fd15b6'
                    }
                    example_api_delete: {
                        table: 'sys_ws_operation'
                        id: '9bc18d538c394c3f9ec517a7b7837f82'
                    }
                    example_api_list: {
                        table: 'sys_ws_operation'
                        id: '62ab094e9e634aa8a52566ccbf5fef32'
                    }
                    example_api_list_limit: {
                        table: 'sys_ws_query_parameter'
                        id: '219109c1a662450ab5ea4d6959718477'
                    }
                    example_api_list_offset: {
                        table: 'sys_ws_query_parameter'
                        id: '2eeb0c82f1414385b741e054fa32f487'
                    }
                    example_api_update: {
                        table: 'sys_ws_operation'
                        id: 'ca5beab643ff4bfe9454ee2cbea2fa21'
                    }
                    example_app_menu: {
                        table: 'sys_app_application'
                        id: '2266887482cf47f79de6844925979254'
                    }
                    example_app_page_module: {
                        table: 'sys_app_module'
                        id: '97607cc4e92b4b8c814c90c35ed418a5'
                    }
                    example_app_suite: {
                        table: 'sys_atf_test_suite'
                        id: '30b44a86940a48bfa3df3e88af27c8ed'
                    }
                    example_item_create_acl: {
                        table: 'sys_security_acl'
                        id: 'f70407cc5703459fb721da687990fe67'
                    }
                    example_item_delete_acl: {
                        table: 'sys_security_acl'
                        id: '78d579d7962f4e9799b694b8e2387946'
                    }
                    example_item_read_acl: {
                        table: 'sys_security_acl'
                        id: 'dae17fd1188c4deda61b455115f1e290'
                    }
                    example_item_security_test: {
                        table: 'sys_atf_test'
                        id: 'd1242dda08cc45b1a55a54392bad2900'
                    }
                    example_item_test: {
                        table: 'sys_atf_test'
                        id: 'f14d556c9daa42daa7407b3c2a044c3b'
                    }
                    example_item_user_role_test: {
                        table: 'sys_atf_test'
                        id: '80a9ac95adfd4cf4b4787a29c8e4d566'
                    }
                    example_item_write_acl: {
                        table: 'sys_security_acl'
                        id: 'df5ab481c36145d9bd22a2b4504f760e'
                    }
                    example_items_module: {
                        table: 'sys_app_module'
                        id: 'f5a7da8667c648b8b6c52168a4a4dfc0'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '866011ffbb6943eaa6f62b613fa97967'
                    }
                    sample_item_1: {
                        table: 'x_snc_example_item'
                        id: '3e4314dcfbfa477bbecc9e213a7ae638'
                    }
                    sample_item_2: {
                        table: 'x_snc_example_item'
                        id: '2659f9a1f84e494ca906071aeae7a511'
                    }
                    sample_item_3: {
                        table: 'x_snc_example_item'
                        id: '48d805eab3434aa6bd3fbff0279c066a'
                    }
                    src_server_AppService_server_js: {
                        table: 'sys_module'
                        id: '10eaf69984d946699265013232de4b4f'
                    }
                    test_step_create_app_user: {
                        table: 'sys_atf_step'
                        id: '422c26d8a8224f6d8a35caae92089aae'
                    }
                    test_step_create_user: {
                        table: 'sys_atf_step'
                        id: '284b3245464642b99e3985b682c2e3e0'
                    }
                    test_step_denied_insert: {
                        table: 'sys_atf_step'
                        id: '8bd69aad192349cb85942912e66f15d3'
                    }
                    test_step_denied_service: {
                        table: 'sys_atf_step'
                        id: '64a1f70810c443a6814a5b3f8215ff9b'
                    }
                    test_step_insert: {
                        table: 'sys_atf_step'
                        id: '5c2d32fe9b4a4b3b8162c46ef467614e'
                    }
                    test_step_seed_insert: {
                        table: 'sys_atf_step'
                        id: 'd140f3e79e8b402281ebbe8821508bb4'
                    }
                    test_step_service: {
                        table: 'sys_atf_step'
                        id: '7a17d7df1bbf40fa82b489b9b31dc2e3'
                    }
                    test_step_user_denied_delete: {
                        table: 'sys_atf_step'
                        id: 'cb268f6c503e4060b9948bc89f559264'
                    }
                    test_step_user_denied_update: {
                        table: 'sys_atf_step'
                        id: '79eb4be8179b4877bb78498870fbfb20'
                    }
                    test_step_user_seed_unchanged: {
                        table: 'sys_atf_step'
                        id: '720e91b410704704b24bacfb4da436bc'
                    }
                    test_step_user_service: {
                        table: 'sys_atf_step'
                        id: '2c5fe9054eff49a2a3a11c53333e6acd'
                    }
                    test_step_validate: {
                        table: 'sys_atf_step'
                        id: '0166ecf4b56943359e0ee5598ef8e81a'
                    }
                }
                composite: [
                    {
                        table: 'sys_ux_lib_asset'
                        id: '005e4569dd8245a7ba6267c1ea71942e'
                        key: {
                            name: 'x_snc_example/app'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '01207ac57696494081a8b6e4fb123635'
                        key: {
                            name: 'x_snc_example_item'
                            element: 'x_snc_example_description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '056932ea57b54c87980c36c4364abba4'
                        key: {
                            id: '2c5fe9054eff49a2a3a11c53333e6acd'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            field: 'script'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '0596df8d388449fa8cab4426943f2358'
                        key: {
                            name: 'x_snc_example_item'
                            element: 'x_snc_example_category'
                            value: 'important'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '0e9adca279394d46aa5fe1204f4f81be'
                        key: {
                            id: '79eb4be8179b4877bb78498870fbfb20'
                            table: 'var__m_atf_input_variable_17a72288df60220062fe6c7a4df26397'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '11dea1391e574238b80a07d3af500a6e'
                        key: {
                            document_key: '8bd69aad192349cb85942912e66f15d3'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '1229953e62ca4234ba0a70f626f2300a'
                        key: {
                            document_key: 'd140f3e79e8b402281ebbe8821508bb4'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '17183a6681f04b57a7f8631216e9dd84'
                        key: {
                            id: '0166ecf4b56943359e0ee5598ef8e81a'
                            table: 'var__m_atf_input_variable_1f39a288df60220062fe6c7a4df2639d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '1bd6c279bada44b0a2bdb2b9dcbe22a1'
                        key: {
                            document_key: '720e91b410704704b24bacfb4da436bc'
                            variable: 'cbddfa135320220002c6435723dc3415'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1c1b07aafa774de08905e60b0ad0bfee'
                        key: {
                            name: 'x_snc_example_item'
                            element: 'x_snc_example_priority'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '1caa9e740e9e49a6821469e354f8d34f'
                        key: {
                            name: 'x_snc_example/app.js.map'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '1caecdf2eb794e2fb1044a6d894261e8'
                        key: {
                            document_key: '8bd69aad192349cb85942912e66f15d3'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '1d6b32c865ef495382530e444373b314'
                        key: {
                            document_key: '284b3245464642b99e3985b682c2e3e0'
                            variable: '6f69fc4aff6433008d3f5d9ad53bf18c'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '1d86eb0bc6ad458c84783222c51381ae'
                        key: {
                            document_key: '284b3245464642b99e3985b682c2e3e0'
                            variable: '1985e0ceff2433008d3f5d9ad53bf1ba'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '1f42ea6d756041e48b561410a3fc7329'
                        key: {
                            application_file: '1caa9e740e9e49a6821469e354f8d34f'
                            source_artifact: '7eb8d4f6778241ac921512eb969104c2'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '25d52925e19a4fdfac88e5988661d191'
                        key: {
                            application_file: '005e4569dd8245a7ba6267c1ea71942e'
                            source_artifact: '7eb8d4f6778241ac921512eb969104c2'
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: '265e5d80c29143128318de91cf3f76c8'
                        key: {
                            test_suite: '30b44a86940a48bfa3df3e88af27c8ed'
                            test: '80a9ac95adfd4cf4b4787a29c8e4d566'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '268c97bb7de64324825f5e9e506426db'
                        key: {
                            document_key: '0166ecf4b56943359e0ee5598ef8e81a'
                            variable: 'ff6e125353a0220002c6435723dc3442'
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: '288dddfd5c8945f3a108c29233ca74c2'
                        key: {
                            test_suite: '30b44a86940a48bfa3df3e88af27c8ed'
                            test: 'd1242dda08cc45b1a55a54392bad2900'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '2d78c2ed4876442fa534ac62f9c1afe4'
                        key: {
                            document_key: 'cb268f6c503e4060b9948bc89f559264'
                            variable: '8f7d0f935320220002c6435723dc3471'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '339ed5b4d78940f9bc3ae77b98249c29'
                        key: {
                            document_key: '422c26d8a8224f6d8a35caae92089aae'
                            variable: '1778a7480f20101091d0f00c97767e03'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '34bc0d0ae0a84ad2989a0057eca6ed7c'
                        key: {
                            name: 'x_snc_example_item'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '3646a5f320714cd997b61b25f3dd4333'
                        key: {
                            document_key: '5c2d32fe9b4a4b3b8162c46ef467614e'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '38f8c01b4a0042fb8a4b3868f2cc8c99'
                        key: {
                            document_key: '422c26d8a8224f6d8a35caae92089aae'
                            variable: 'b27b2b29ff6033008d3f5d9ad53bf164'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3941591e74b14a2aa3027c669a52b1ae'
                        key: {
                            name: 'x_snc_example_item'
                            element: 'x_snc_example_category'
                            value: 'urgent'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '3b43bc4eceb849ecba13fbb034adb244'
                        key: {
                            document_key: '0166ecf4b56943359e0ee5598ef8e81a'
                            variable: '6aad5a575360220002c6435723dc34b0'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3cd88c7dbff047398fe34523b019a963'
                        key: {
                            name: 'x_snc_example_item'
                            element: 'x_snc_example_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '3d6bed88c613467494a2e33b0c130014'
                        key: {
                            document_key: '720e91b410704704b24bacfb4da436bc'
                            variable: 'ff6e125353a0220002c6435723dc3442'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: '3e3898bd9b894f51ac2b29ba2f9d71c8'
                        key: {
                            name: 'x_snc_example.admin'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '3fcd771fe71442a3969bb82817316b90'
                        key: {
                            document_key: '284b3245464642b99e3985b682c2e3e0'
                            variable: 'ff06ab840f20101091d0f00c97767e6d'
                        }
                    },
                    {
                        table: 'sys_user_role_contains'
                        id: '413ee2c689174a86a88393f5e41e7540'
                        key: {
                            role: {
                                id: '3e3898bd9b894f51ac2b29ba2f9d71c8'
                                key: {
                                    name: 'x_snc_example.admin'
                                }
                            }
                            contains: {
                                id: 'b68c9e3bbe6043748ae0c897a466b966'
                                key: {
                                    name: 'x_snc_example.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4303117503394e829214b0178eb83473'
                        key: {
                            document_key: '79eb4be8179b4877bb78498870fbfb20'
                            variable: '46dbcb535320220002c6435723dc3409'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4aecafcdd2094836a7ac8a93fe2e7e51'
                        key: {
                            document_key: '64a1f70810c443a6814a5b3f8215ff9b'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '4d1827ab194049c8ad7c78811d6bd151'
                        key: {
                            id: '64a1f70810c443a6814a5b3f8215ff9b'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            field: 'script'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4d8795f4370c44a68c9ab6fd5f0b14f7'
                        key: {
                            document_key: '8bd69aad192349cb85942912e66f15d3'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4e696324a62f40739f052578bfbab9a3'
                        key: {
                            document_key: '0166ecf4b56943359e0ee5598ef8e81a'
                            variable: 'cbddfa135320220002c6435723dc3415'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '5b88c9ff0ddf436e8c8d4ee47101a8a2'
                        key: {
                            id: 'cb268f6c503e4060b9948bc89f559264'
                            table: 'var__m_atf_input_variable_8df72288df60220062fe6c7a4df2636d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '5d38cf3afb5d4a6283653b451ac3d45c'
                        key: {
                            document_key: 'cb268f6c503e4060b9948bc89f559264'
                            variable: '3d6d8b935320220002c6435723dc349c'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '6123a93782ec48c480813f6e37f9e608'
                        key: {
                            document_key: 'd140f3e79e8b402281ebbe8821508bb4'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '61d09823bfa6487eb36f6008eba0b45e'
                        key: {
                            name: 'x_snc_example_item'
                            element: 'x_snc_example_category'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '63bb1f877095481784ca7251a1813e2d'
                        key: {
                            document_key: '284b3245464642b99e3985b682c2e3e0'
                            variable: 'b27b2b29ff6033008d3f5d9ad53bf164'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '642f57553fd0429aaa2a08aa89bc8ea2'
                        key: {
                            name: 'x_snc_example_item'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ws_query_parameter_map'
                        id: '65dda83d770a429fa18e9b10c67b9adb'
                        key: {
                            web_service_operation: '62ab094e9e634aa8a52566ccbf5fef32'
                            web_service_query_parameter: '2eeb0c82f1414385b741e054fa32f487'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '67a36f8ea58542bab0ed04fd9090aed0'
                        key: {
                            document_key: '5c2d32fe9b4a4b3b8162c46ef467614e'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6e3359bc32ac44ecacc4851c70a35ced'
                        key: {
                            name: 'x_snc_example_item'
                            element: 'x_snc_example_name'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '6e971f4bf8434e71aefb1a59ac0d7331'
                        key: {
                            document_key: '0166ecf4b56943359e0ee5598ef8e81a'
                            variable: '67400008676003007ba405225685efa4'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '6f54acf26aa748beb172064087102eef'
                        key: {
                            document_key: '422c26d8a8224f6d8a35caae92089aae'
                            variable: '98c44875ffa033008d3f5d9ad53bf1fa'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '703693f277724a75905aa1deda97b718'
                        key: {
                            name: 'x_snc_example_item'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '72d3b6b846b94c8f9675624410b53475'
                        key: {
                            document_key: '5c2d32fe9b4a4b3b8162c46ef467614e'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7a9565902a594d33974bbd9a7252ca2f'
                        key: {
                            document_key: '720e91b410704704b24bacfb4da436bc'
                            variable: '52ed1e5b5360220002c6435723dc3421'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact'
                        id: '7eb8d4f6778241ac921512eb969104c2'
                        key: {
                            name: 'x_snc_example_app.do - BYOUI Files'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7f99216431ba4b02a551e9e6cae8c305'
                        key: {
                            document_key: 'cb268f6c503e4060b9948bc89f559264'
                            variable: 'c7e483f3671003007ba405225685effb'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '80dd222183784adea07d414cbd4133b7'
                        key: {
                            id: '720e91b410704704b24bacfb4da436bc'
                            table: 'var__m_atf_input_variable_1f39a288df60220062fe6c7a4df2639d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '82cb67d3f3944410b0d2e5dabbeb0b34'
                        key: {
                            name: 'x_snc_example_item'
                            element: 'x_snc_example_category'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '8476788d589a461abbe5b2a8f131d805'
                        key: {
                            document_key: '284b3245464642b99e3985b682c2e3e0'
                            variable: '98c44875ffa033008d3f5d9ad53bf1fa'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '8488fcdbadc94bc297bc5ef748791b38'
                        key: {
                            name: 'x_snc_example_item'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '87293cda704f4eeab91a2166c8e7e381'
                        key: {
                            document_key: '720e91b410704704b24bacfb4da436bc'
                            variable: '6aad5a575360220002c6435723dc34b0'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '8a3087a54f814f4b9818517400043ab1'
                        key: {
                            document_key: '422c26d8a8224f6d8a35caae92089aae'
                            variable: '1985e0ceff2433008d3f5d9ad53bf1ba'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '90c6437c93024c66947b7ad200e0df3f'
                        key: {
                            document_key: 'cb268f6c503e4060b9948bc89f559264'
                            variable: 'd13d0b935320220002c6435723dc34c8'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9273ee34830a456a9316f2757050bd30'
                        key: {
                            document_key: 'd140f3e79e8b402281ebbe8821508bb4'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9a78552bd8954944a6e20cb18e484bce'
                        key: {
                            document_key: '2c5fe9054eff49a2a3a11c53333e6acd'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a02231b4931e4f6ea9822d7b41b88f62'
                        key: {
                            name: 'x_snc_example_item'
                            element: 'x_snc_example_description'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'a16f0f5d61dc4132bcfac823ff3685a1'
                        key: {
                            document_key: '79eb4be8179b4877bb78498870fbfb20'
                            variable: '53fb0f535320220002c6435723dc34ec'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'a62a2217f6604f55b70073e955745b83'
                        key: {
                            sys_security_acl: 'df5ab481c36145d9bd22a2b4504f760e'
                            sys_user_role: {
                                id: '3e3898bd9b894f51ac2b29ba2f9d71c8'
                                key: {
                                    name: 'x_snc_example.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: 'a8564567698946f1913b0b3242faac53'
                        key: {
                            test_suite: '30b44a86940a48bfa3df3e88af27c8ed'
                            test: 'f14d556c9daa42daa7407b3c2a044c3b'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'a95f0f10a0ab4bd081294a9b07fa77f1'
                        key: {
                            application_file: 'd15c2ef798ed402b9bdaffa364c796af'
                            source_artifact: '7eb8d4f6778241ac921512eb969104c2'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'aa938aa49533484f847e4f713083a400'
                        key: {
                            document_key: '284b3245464642b99e3985b682c2e3e0'
                            variable: '1778a7480f20101091d0f00c97767e03'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'ae4f5b2a7d014623905418bcf716a834'
                        key: {
                            name: 'x_snc_example_item'
                            element: 'x_snc_example_category'
                            value: 'general'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'b277906148c14ae2a134909b4bf7a4d4'
                        key: {
                            name: 'x_snc_example_item'
                            element: 'x_snc_example_category'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'b43d2557cf464e0682fd9a66c8e42a19'
                        key: {
                            document_key: '2c5fe9054eff49a2a3a11c53333e6acd'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: 'b68c9e3bbe6043748ae0c897a466b966'
                        key: {
                            name: 'x_snc_example.user'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'bd1010a841f446a5b040b6f62656187a'
                        key: {
                            sys_security_acl: '084f95a87ade40079f5e5ca6046e3dda'
                            sys_user_role: {
                                id: 'b68c9e3bbe6043748ae0c897a466b966'
                                key: {
                                    name: 'x_snc_example.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c6db63fd7416480399b316122e00d383'
                        key: {
                            document_key: '422c26d8a8224f6d8a35caae92089aae'
                            variable: 'ff06ab840f20101091d0f00c97767e6d'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'c8b4fdbdf83b48e6b7c5ececf2041057'
                        key: {
                            sys_security_acl: 'dae17fd1188c4deda61b455115f1e290'
                            sys_user_role: {
                                id: 'b68c9e3bbe6043748ae0c897a466b966'
                                key: {
                                    name: 'x_snc_example.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'cd523ca0eaa8408e8330dea172a596c1'
                        key: {
                            document_key: '79eb4be8179b4877bb78498870fbfb20'
                            variable: 'bc4c43935320220002c6435723dc34a2'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'cf84f7a229a14bf983cd38bc992c79a5'
                        key: {
                            document_key: '422c26d8a8224f6d8a35caae92089aae'
                            variable: '8c07aba5ff6033008d3f5d9ad53bf13b'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'd0eca664e0674e8e8bd3442b36dc4d91'
                        key: {
                            document_key: '79eb4be8179b4877bb78498870fbfb20'
                            variable: '334b7bb7675003007ba405225685ef72'
                        }
                    },
                    {
                        table: 'sys_ui_page'
                        id: 'd15c2ef798ed402b9bdaffa364c796af'
                        key: {
                            endpoint: 'x_snc_example_app.do'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'd953e91f75364279a0422833a93beb25'
                        key: {
                            sys_security_acl: 'f70407cc5703459fb721da687990fe67'
                            sys_user_role: {
                                id: 'b68c9e3bbe6043748ae0c897a466b966'
                                key: {
                                    name: 'x_snc_example.user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'dcc6571d1bf44da7a06dd03ca973ab6d'
                        key: {
                            document_key: '0166ecf4b56943359e0ee5598ef8e81a'
                            variable: '52ed1e5b5360220002c6435723dc3421'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'df283569ed6d40098c646db22489f1bc'
                        key: {
                            document_key: 'd140f3e79e8b402281ebbe8821508bb4'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'df568bb3ca0b498bb9221ee34365cf7a'
                        key: {
                            document_key: '64a1f70810c443a6814a5b3f8215ff9b'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e1c298b213ab4a74885ee9c0cba0d74b'
                        key: {
                            document_key: '5c2d32fe9b4a4b3b8162c46ef467614e'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e1c58b525f5145d8bdfe2ea3dc737562'
                        key: {
                            name: 'x_snc_example_item'
                            element: 'x_snc_example_priority'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e4a0a3faeb7a410aa7c8efd40a049b8f'
                        key: {
                            document_key: '720e91b410704704b24bacfb4da436bc'
                            variable: '67400008676003007ba405225685efa4'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e58fbbb8ab4545029f2f8507e703debe'
                        key: {
                            document_key: '8bd69aad192349cb85942912e66f15d3'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e9fa0bb1c7044cbda9eec0ff487f8baf'
                        key: {
                            document_key: '79eb4be8179b4877bb78498870fbfb20'
                            variable: '501c8f535320220002c6435723dc34da'
                        }
                    },
                    {
                        table: 'sys_ws_query_parameter_map'
                        id: 'eba73b87b2b64ea0a751847cd5381e8c'
                        key: {
                            web_service_operation: '62ab094e9e634aa8a52566ccbf5fef32'
                            web_service_query_parameter: '219109c1a662450ab5ea4d6959718477'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'ec056004e63d479dac5deb9528cfd9e9'
                        key: {
                            document_key: '7a17d7df1bbf40fa82b489b9b31dc2e3'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'ef598d070da748a789f9d00fae8db136'
                        key: {
                            id: '7a17d7df1bbf40fa82b489b9b31dc2e3'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            field: 'script'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'f4e384349d9b45e0896459ac09a60650'
                        key: {
                            document_key: '422c26d8a8224f6d8a35caae92089aae'
                            variable: '6f69fc4aff6433008d3f5d9ad53bf18c'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'f889da3fdc6c42258a55563ba96dc4e9'
                        key: {
                            document_key: '284b3245464642b99e3985b682c2e3e0'
                            variable: '8c07aba5ff6033008d3f5d9ad53bf13b'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'f9216b18a35b454cadfbd4e0bd90b421'
                        key: {
                            document_key: '7a17d7df1bbf40fa82b489b9b31dc2e3'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'faec45bb31bd484dbd652094b7848f27'
                        key: {
                            sys_security_acl: '78d579d7962f4e9799b694b8e2387946'
                            sys_user_role: {
                                id: '3e3898bd9b894f51ac2b29ba2f9d71c8'
                                key: {
                                    name: 'x_snc_example.admin'
                                }
                            }
                        }
                    },
                ]
            }
        }
    }
}
