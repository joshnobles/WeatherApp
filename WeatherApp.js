document.querySelector('.container').addEventListener('keypress', (e) => {
    if (e.key == 'Enter')
        getWeather()
})

let error = document.querySelector('#error')
let result = document.querySelector('#result')

async function getWeather() {
    let input = document.querySelector('#zipCode').value

    error.hidden = true

    if (input.length != 5) {
        error.innerHTML = 'Must be a 5 digit zip code'
        error.hidden = false
        return
    }

    for (let c of input) {
        if (isNaN(parseInt(c))) {
            error.innerHTML = 'All characters must be numbers'
            error.hidden = false
            return
        }
    }

    await fetch(`https://api.openweathermap.org/data/2.5/forecast?zip=${input},US&appid=8ebcafe50559caef12a8b9a1153a3caa`)
        .then(res => res.json())
        .then(json => {
            if (json.cod != '200') {
                if (json.cod == '404') {
                    error.innerHTML = 'City not found'
                    error.hidden = false
                    console.log(json)
                    return
                }
                error.innerHTML = 'There was an error getting the weather'
                error.hidden = false
                console.log(json)
                return
            }

            result.innerHTML = '<hr>'
            result.innerHTML += '<div class="row">'
            result.innerHTML += `<div class="col-12 mb-4"><h3>Three day forecast for ${json.city.name}:</h3></div>`

            let date = new Date(0)
            let count = 0
            for(let d of json.list) {
                if (count == 3)
                    break

                if (new Date(d.dt * 1000).getDate() == date.getDate())
                    continue

                date = new Date(d.dt * 1000)
                
                result.innerHTML += '<ul class="list-group">'
                    
                result.innerHTML += `<li class="list-group-item"><h5>${date.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</h5></li>`
                result.innerHTML += `<li class="list-group-item"><div class="row"><div class="col-2"><strong>Weather:</strong></div><div class="col-4">${d.weather[0].description}</div></div></li>`
                result.innerHTML += `<li class="list-group-item"><div class="row"><div class="col-2"><strong>Temperature:</strong></div><div class="col-4">${Math.round(kToF(d.main.temp))}F</div></div></li>`
                result.innerHTML += `<li class="list-group-item"><div class="row"><div class="col-2"><strong>Wind Speed:</strong></div><div class="col-4">${d.wind.speed} mph</div></div></li>`
                result.innerHTML += '</ul>'
                result.innerHTML += '<br>'
                
                count++
            }

            result.innerHTML += '</div>'
        })

}

function kToF(k) {
    return (k - 273.15) * 9/5 + 32
}
