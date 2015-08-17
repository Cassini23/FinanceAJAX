/**
 * On DOM content loaded
 */
document.addEventListener('DOMContentLoaded', function(){
    var btn = document.querySelector('#btnSearch');
    var input = document.querySelector('#searchText');
    var resultDiv = document.querySelector('#result');
    var s = new service();
    var err = '';
    btn.addEventListener('click',function(){
        if(input.value.length > 0){
           var template =  s.getData({"searchtext": input.value});
            console.log(template);
        }
        else err ='Error: no search criteria provided';
    });
});

/**
 * @function : AJAX service
 */
var service =  function(){

};

/**
 *@function getData : Make an AJAX get request to process data
 * @param data
 */
service.prototype.getData = function(data){
    makeAJAXCall('GET', 'data/products.json', data);
};

/**
 * @function Definition for the AJAX call
 * @param HTTPVerb
 * @param url
 * @param data
 */
function makeAJAXCall(HTTPVerb, url, data){
    var pieData = [];
    var xhr = new XMLHttpRequest();
    xhr.open(HTTPVerb, url);
    //xhr.setRequestHeader('content-type', 'application/json');
    xhr.addEventListener('readystatechange',function(){
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                var dataArray = processData(JSON.parse(xhr.responseText),data);
                createTemplate(dataArray);
//                createPieChart('Institution type', 'Type' , pieData);
            }
        }
    });
    xhr.send();
}

/**
 * @function process data to sort data by type [sort financial institution by type]
 * @param result
 * @param data
 * @returns {{}}
 */
function processData(result, data) {
    var arr = {};
    result["products"].map(function(item){
        if(item["name"].indexOf(data.searchtext) !== -1){
            if(arr[item["type"]]){
                arr[item["type"]].push(item);
            }
            else arr[item["type"]] = [];
        }
    });
    return arr;
}

/**
 * @function create DOM element
 * @param elementType
 * @param parent
 * @param className
 * @param innerHTML
 * @param custom
 * @returns {HTMLElement}
 */
function createElement(elementType, parent, className, innerHTML, custom) {
   var element = document.createElement(elementType);
   if (parent) parent.appendChild(element);
   if (className) element.className = className;
   if (innerHTML) element.innerHTML = innerHTML;
   if (typeof custom !== 'undefined') {
       for (var prop in custom) {
           element.setAttribute(prop, custom[prop]);
       }
   }
   return element;
}

/**
 * @function create a template to display each object found in the resultset
 * @param dataObject
 * @returns {HTMLElement}
 */
function createTemplate(dataObject){
    var result = document.querySelector('#result');
    for(var prop in dataObject){ //each type
        if(dataObject[prop].length >0){
            var h4  =createElement('h4',result,'resultTitle', prop,null)
            var ul =  createElement('ul',result,'resultUl-'+prop,null,null);
            dataObject[prop].forEach(function(subitem){
                var liname = createElement('li',ul,'li-name', subitem.name,null);
                var liurl = createElement('li',ul,'li-url', null,null);
                var url  = createElement('a',liurl,'a-url',subitem.url,{'href': subitem.url});
                //var litype = createElement('li',ul,'li-type', subitem.type,null);
            });
        }
    }
    return result; //returns the whole results template
}