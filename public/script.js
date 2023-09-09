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
