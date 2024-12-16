document.addEventListener('DOMContentLoaded', function () {

    console.log("DOM Content loaded: Sidebar")
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const currentPath = window.location.pathname;

    // enable active sidebar accroding to pathname
    sidebarLinks.forEach(link => {
     
      link.parentElement.classList.remove("active");
      let parentPrefix = link.getAttribute("href").split("-")[0]
      let hrefPrefix = (currentPath+"-bbb").split("-")[0]

     
   
      if(parentPrefix === hrefPrefix){
        console.log({hrefPrefix,parentPrefix})
        console.log({currentPath,link:link.attributes.href,parent:link.parentElement})
        link.parentElement.classList.add("active");
      }
    });


   
});