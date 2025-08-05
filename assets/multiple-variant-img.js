document.addEventListener('variant:update', function(event){
    // Access the selected variant object
    const variant = event.detail.resource;

    console.log(variant)
})