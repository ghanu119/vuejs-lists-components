<template>
    <div class="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div class="grid grid-cols-3 gap-2" v-if="components.length">

            <div>
                <select v-model="selected.component" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="">Select component</option>
                    <option :value="cIdx" v-for="(component, cIdx ) in components" :key="'component_' + cIdx ">{{ component.name }}</option>
                </select>
                <p v-if="selectedComponent && selectedComponent.description">
                    {{ selectedComponent.description }}
                </p>
            </div>
            <div v-if="propsList && propsList.length">
                <select v-model="selected.prop" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="">Select prop</option>
                    <option :value="pData.name" v-for="(pData, pIdx ) in propsList" :key="'prop_' + pIdx ">{{ pData.name }}</option>
                </select>

            </div>
            <div v-else class="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400">
                No Props Found
            </div>

            <div v-if="selected.prop !== ''">
                <button type="button" @click="addProp" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"> Add Prop</button>
            </div>
        </div>
        <div v-else class="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400">
            No Components found
        </div>

        <div v-if="componentPlayGroundStr" class="p-3 text-gray-500 text-size-lg">
            <figure>
                <code data-lang="html" class="language-html text-left p-4 bg-black text-sky-600 font-bold  block whitespace-pre overflow-x-scroll">{{ componentPlayGroundStr }}</code>
            </figure>
        </div>
        <div v-if="props.length" class="relative overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th class="px-6 py-3">
                            Name
                        </th>
                        <th class="px-6 py-3">
                            Type
                        </th>
                        <th class="px-6 py-3">
                            Description
                        </th>
                        <!-- <th class="px-6 py-3">
                            is dynamic?
                        </th> -->
                        <th class="px-6 py-3">
                            Value
                        </th>
                        <th class="px-6 py-3">
                            Action
                        </th>
                    </tr>
                    <tr v-for="(pData, pIdx) in props" :key="'prop_table'+pIdx" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td class="px-6 py-3">
                            {{ pData.kababName }}
                        </td>
                        <td class="px-6 py-3">
                            {{ pData.type_text }}
                        </td>
                        <td class="px-6 py-3">
                            {{ pData.description || '-' }}
                        </td>
                        <!-- <td class="px-6 py-3">
                            <input type="checkbox" :value="true" v-model="pData.is_dynamic">
                        </td> -->
                        <td class="px-6 py-3">
                            <textarea v-model="pData.value" v-if="pData.is_array_object" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                            <input type="text" v-else v-model="pData.value" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        </td>
                        <td class="px-6 py-3">
                            <button type="button" @click="removeSelectedProp(pIdx)" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"> Remove </button>
                        </td>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            components: [],
            selected:{
                component: '',
                prop: ''
            },
            props: []
        }
    },
    mounted(){
        this.$nextTick( () => {
            this.loadComponentsFromArray( this.$components );

        })
        if( this.$root?.$?.appContext?.components && Object.keys( this.$root?.$?.appContext?.components ).length ){
            const allComponents = this.$root?.$?.appContext?.components;
            // this.loadComponents( allComponents );
        }
    },
    computed:{
        selectedComponent(){
            if( this.selected.component !== null && this.selected.component !== "" ) {
                return this.components[ this.selected.component ];
            }
            return null;
        },
        propsList(){
            if( this.selectedComponent && this.selectedComponent.props && this.selectedComponent.props.length ){
                const selectedProp = this.props.map( d => d.name );
                return this.selectedComponent.props.filter( d => !selectedProp.includes( d.name ) );
            }
            return null
        },
        componentPlayGroundStr () {
            if( this.selectedComponent ){

                let props = [];
                this.props.forEach( propD => {
                    let isDynamicVal = propD.is_dynamic;
                    let parameterStr;
                    let selectedVal = propD.value;
                    if( selectedVal ){
                        if( isDynamicVal ){
                            if( !propD.is_array_object  && typeof selectedVal == "string" ){
                                selectedVal = "'" + selectedVal + "'";
                            }else{
                                selectedVal = selectedVal.replaceAll("\n", "");

                            }
                        }
                    }else{
                        if( typeof propD.default === "string" ){
                            selectedVal =  propD.default;
                        }else{
                            selectedVal = (Array.isArray( propD.default ) || typeof propD.default == 'object') && propD.default !== null ? JSON.stringify( propD.default ) : propD.default;
                        }


                    }
                    if( selectedVal === undefined ){
                        selectedVal = "";
                    }
                    parameterStr = ( isDynamicVal ? ':':'') +propD.kababName + "='" + selectedVal + "'";

                    props.push( parameterStr )
                })
                let str = '<' + this.selectedComponent.name + ( props.length ? '\n\t' : '') +props.join("\n\t") +' > '+ ( props.length ? '\n' : '') + '</' + this.selectedComponent.name +'>';

                return str;
            }
            return null;
        }
    },
    watch:{
        'selected.component' () {
            this.props = [];
        },
        '$components' ( nV ) {
            if( nV.length ){
                this.components = [];
                this.loadComponentsFromArray( nV );
            }
        }
    },
    methods: {
        loadComponentsFromArray ( components ){
            if( components && Array.isArray( components ) && components.length ){
                components.forEach( cData => {
                    let propsArr = [];
                    if( cData.props && Object.keys( cData.props ).length ){
                        Object.keys( cData.props ).forEach( propKey => {
                            const _propData =  cData.props[ propKey ];
                            let defaultProp = null;
                            let propTypes = _propData.type;
                            let propTypesText = _propData.type;
                            if( propTypes === undefined && typeof _propData == "function" ){
                                propTypes = _propData;
                                propTypesText = _propData.name;
                            }
                            let isArrayObject = false;
                            let isString = false;
                            if( typeof _propData.default === "function" ){
                                defaultProp = _propData.default();

                            }else{
                                defaultProp = _propData.default;
                            }
                            if( propTypes ){
                                if( Array.isArray( propTypes ) ){
                                    propTypes = propTypes.map( pT => pT.name );
                                    propTypesText = propTypes.join(" | ");
                                    isArrayObject = propTypes.some( pD => (['Array', 'Object']).includes( pD ) );
                                    isString = propTypes.some( pD => pD === "String" );
                                }else{
                                    propTypes = propTypes.name;
                                    isArrayObject = (['Array', 'Object']).includes( propTypes );
                                    isString = propTypes === "String";
                                    propTypesText = propTypes;

                                }
                            }
                            let tmpPropData = {
                                name: propKey,
                                kababName: propKey.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase(),
                                default: defaultProp,
                                type: propTypes,
                                type_text: propTypesText,
                                is_array_object: isArrayObject,
                                is_dynamic: !isString,
                                description: _propData.description || ''
                            }
                            propsArr.push( tmpPropData );
                        })
                    }
                    let tmpObj = {
                        name: (cData.name || cData.componentName).replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase(),
                        props: propsArr,
                        description: cData.description || '',
                        file_path: cData.__file
                    }
                    this.components.push( tmpObj );
                })
            }
        },
        loadComponents ( components ){
            Object.keys( components ).forEach( cKey => {
                const componentData = components[ cKey ];
                if( this.components.findIndex( d => d.name == cKey ) === -1 && componentData.__file !== undefined ){
                    let propsArr = [];
                    if( componentData.props && Object.keys( componentData.props ).length ){
                        Object.keys( componentData.props ).forEach( propKey => {
                            const _propData =  componentData.props[ propKey ];
                            let defaultProp = null;
                            let propTypes = _propData.type;
                            let propTypesText = _propData.type;
                            if( propTypes === undefined && typeof _propData == "function" ){
                                propTypes = _propData;
                                propTypesText = _propData.name;
                            }
                            let isArrayObject = false;
                            let isString = false;
                            if( typeof _propData.default === "function" ){
                                defaultProp = _propData.default();

                            }else{
                                defaultProp = _propData.default;
                            }
                            if( propTypes ){
                                if( Array.isArray( propTypes ) ){
                                    propTypes = propTypes.map( pT => pT.name );
                                    propTypesText = propTypes.join(" | ");
                                    isArrayObject = propTypes.some( pD => (['Array', 'Object']).includes( pD ) );
                                    isString = propTypes.some( pD => pD === "String" );
                                }else{
                                    propTypes = propTypes.name;
                                    isArrayObject = (['Array', 'Object']).includes( propTypes );
                                    isString = propTypes === "String";
                                    propTypesText = propTypes;

                                }
                            }
                            let tmpPropData = {
                                name: propKey,
                                kababName: propKey.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase(),
                                default: defaultProp,
                                type: propTypes,
                                type_text: propTypesText,
                                is_array_object: isArrayObject,
                                is_dynamic: !isString,
                                description: _propData.description || ''
                            }
                            propsArr.push( tmpPropData );
                        })
                    }
                    let tmpObj = {
                        name: cKey,
                        props: propsArr,
                        description: componentData.description || '',
                        file_path: componentData.__file
                    }
                    this.components.push( tmpObj );
                    if( componentData.components && Object.keys( componentData.components ).length ){
                        this.loadComponents( componentData.components );
                    }
                }
            })
        },
        addProp(){
            if( this.selected.prop !== "" ){
                const findData = this.selectedComponent.props.find( d => d.name == this.selected.prop );
                this.props.push( findData );
                this.selected.prop = '';
            }
        },
        removeSelectedProp ( idx ){
            this.props.splice ( idx, 1);
        }
    }
}
</script>

<style>

</style>
