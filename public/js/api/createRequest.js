/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const formData = new FormData();
    //onst UserUrl = new URL ('http://localhost:8000/');
    const UserUrl = options.url;
    let xhr = new XMLHttpRequest;
    
    xhr.responseType = 'json';

    xhr.addEventListener("readystatechange", () => {
        if (xhr.readyState !== 4) {
            return;
        }
        
        if (xhr.readyState == 4 && xhr.status == 200) {
            options.callback(null, xhr.response);
        } else {
            options.callback(new Error (xhr.status + ":" + xhr.statusText)); 
        }
    }) 
  
    try { 
        xhr.open(options.method, UserUrl);
        if (options.method === 'GET') {
            for (let  item in options.data) {
                UserUrl.searchParams.append(item, options.data[value]);
            }
            console.log(UserUrl.href);
            xhr.send();
        } else {
            for (let item in options.data) { 
                formData.append(item, options.data[item]); 
            }
            xhr.send(formData);
        }
    } catch (err) {
        options.callback(err);
        //throw new Error(err);
    }        
}
