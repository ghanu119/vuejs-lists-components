let components = [];

// If your project is  build in webpack
if( typeof require !== "undefined" ){
    const requireComponent = require.context( './components', true , /\.vue$/)
    requireComponent.keys().forEach( fN => {
        const compStr = fN.replace('./', 'components/');
        import( `./${compStr}` ).then( d => {
            d.default.componentName = compStr.substring( compStr.lastIndexOf('/') + 1).replace('.vue', '');
            components.push( d.default ) ;
        });
    })

}
if( import.meta && import.meta.globEager ){
    const AllVueComponents = import.meta.globEager( './**/**/*.vue');
    Object.keys( AllVueComponents ).map( d => {
        const data = AllVueComponents[ d ];
        const compStr = d;
        data.default.componentName = compStr.substring( compStr.lastIndexOf('/') + 1).replace('.vue', '');
        components.push( data.default ) ;
    })
    if( components.length ){
        components = Object.values(AllVueComponents).map( d => d.default );
    }

}

//
export default components;

/**
 * Add in app.js or main.ts
 *
 *
    import ComponentsList from  './components-list';
    app.config.globalProperties.$components = ComponentsList;
 *
 *
 */
