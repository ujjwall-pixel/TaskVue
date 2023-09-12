var myElement = document.getElementById('myElement');
var customData = JSON.parse(myElement.getAttribute('data-custom-data'));
console.log(customData);
for(let i=0;i<document.querySelectorAll('#task').length;i++){
    document.querySelectorAll('#task')[i].addEventListener("click", function() {
        document.getElementById('tasktitle').innerHTML = customData[i].title;  
        document.getElementById('td').innerHTML =  customData[i].description;  
        document.getElementById('pt').innerHTML =  customData[i].priority;
        document.getElementById('dd').innerHTML =  customData[i].duedate;
        document.getElementById('cg').innerHTML =  customData[i].category;    
        document.getElementById('hiddentitle').value = customData[i].title;                              
    });
}
    function isMobile() {
        return window.innerWidth <= 768;
    }

    if(isMobile){
        document.addEventListener("DOMContentLoaded", function() {
            const menuIcon = document.getElementById("togglemenu");
            const crossIcon = document.getElementById("cross");
            const crosstIcon = document.getElementById("crosst");
            const menuSection = document.querySelector(".menu");
            const mainSection = document.querySelector(".main");
            const taskdesSection = document.querySelector(".taskdescription");
            const taskInput = document.querySelector("#addtask input[type='text']");
            const menuLink1 = document.getElementById("all");
            const menuLink2 = document.getElementById("pending");
            const menuLink3 = document.getElementById("completed");
            const menuLink4 = document.getElementById("today");
            const menuLink5 = document.getElementById("personal");
            const menuLink6 = document.getElementById("work");
            const menuLink7 = document.getElementById("cat1");
            const menuLink8 = document.getElementById("finance");
            const menuLink9 = document.getElementById("shopping");
            const menuLink10 = document.getElementById("event");
            const menuLink11 = document.getElementById("other");
            
            // Function to show only the menu section
            function showMenu() {
                menuSection.style.display = "block";
                mainSection.style.display = "none";
                taskdesSection.style.display = "none";
            }
        
            // Function to show only the main section
            function showMain() {
                menuSection.style.display = "none";
                taskdesSection.style.display = "none";
                mainSection.style.display = "block";
            }
            
            function showtaskDes() {
                menuSection.style.display = "none";
                taskdesSection.style.display = "block";
                mainSection.style.display = "none";
            }
            // Event listener for menu icon click
            menuIcon.addEventListener("click", function() {
                showMenu();
            });
        
            // Event listener for cross icon click
            crossIcon.addEventListener("click", function() {
                showMain();
            });

            crosstIcon.addEventListener("click", function() {
                showMain();
            });

            taskInput.addEventListener("keyup", function(event) {
                if (event.key === "Enter") {
                    setTimeout(showtaskDes, 3000);
                }});
            
            menuLink1.addEventListener("click", function() {
                    showMain();
                });
            
            menuLink2.addEventListener("click", function() {
                    showMain();
                });    

                menuLink3.addEventListener("click", function() {
                    showMain();
                });

                menuLink4.addEventListener("click", function() {
                    showMain();
                });

                menuLink5.addEventListener("click", function() {
                    showMain();
                });

                menuLink6.addEventListener("click", function() {
                    showMain();
                });

                menuLink7.addEventListener("click", function() {
                    showMain();
                });

                menuLink8.addEventListener("click", function() {
                    showMain();
                });

                menuLink9.addEventListener("click", function() {
                    showMain();
                });

                menuLink10.addEventListener("click", function() {
                    showMain();
                });

                menuLink11.addEventListener("click", function() {
                    showMain();
                });
            for(let i=0;i<document.querySelectorAll('#task').length;i++){
                document.querySelectorAll('#task')[i].addEventListener("click", function() {
                    if(isMobile()){
                    showtaskDes();}
                });}
        });
        
    }
