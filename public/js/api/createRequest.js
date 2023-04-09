/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    let UserUrl = new URL(options.url, "http://localhost:8000/");
    let xhr = new XMLHttpRequest();
    
    xhr.responseType = 'json';

    xhr.onload = () => { 
        if (xhr.status != 200) { 
            console.log(`Ошибка ${xhr.status}: ${xhr.statusText}`);
        } else {
            options.callback(null, xhr.response);
        }
    }

    xhr.onerror = () => {
        console.error('Запрос не удался');
    }

    for (let item in options.data) {
        UserUrl.searchParams.append(item, options.data[item]);
    }

    try {
        xhr.open(options.method, UserUrl.href);
        
        if (options.method === 'GET') {
            xhr.send();
        } else {
            let formData = new FormData();
            for (let item in options.data) { 
                formData.append(item, options.data[item]);
            }
            xhr.send(formData);
        }
    } catch (err) {
        options.callback(err);
    }
}
