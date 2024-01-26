import urllib.request
import json
from datetime import datetime

def getAves(json) :
    currentDate = datetime.fromtimestamp(json['list'][0]['dt'])
    tempTotal = 0
    windTotal = 0
    gustTotal = 0
    count = 0
    result = []
    repeat = 0

    for i in json['list'] :
        if (repeat == 3) :
            break

        date = datetime.fromtimestamp(i['dt'])

        if (date.date() == currentDate.date()) :
            tempTotal += i['main']['temp']
            windTotal += i['wind']['speed']
            gustTotal += i['wind']['gust']
            count += 1
        else :
            result.append([round(((tempTotal / count) - 273.15) * 9/5 + 32), round((windTotal / count) * 2.23694), round((gustTotal / count) * 2.23694)])
            currentDate = date
            count = 1
            windTotal = i['wind']['speed']
            tempTotal = i['main']['temp']
            gustTotal = i['wind']['gust']
            repeat += 1
    
    return result

input = input('Enter a 5 digit zip code:\n> ')

if (len(input) != 5) :
    print('\033[91m' + 'input must be 5 digits' + '\033[0m')
    quit()

for i in input :
    try :
        int(i)
    except ValueError :
        print('\033[91m' + 'Each character must be a number' + '\033[0m')
        quit()

try: 
    res = urllib.request.urlopen(f'https://api.openweathermap.org/data/2.5/forecast?zip={input},US&appid=8ebcafe50559caef12a8b9a1153a3caa').read()
except urllib.error.HTTPError as e :
    if (e.code == 404) :
        print('\033[91m' + 'City Not Found' + '\033[0m')
    else :
        print('\033[91m' + 'There was an error fetching the weather' + '\033[0m')
    quit()

out = json.loads(res)

output = f'\nThe Weather in {out['city']['name']} is:\n\n'

aves = getAves(out)

usedDate = datetime.fromtimestamp(0)
count = 0
for i in out['list'] :
    if (count == 3) :
        break

    d = datetime.fromtimestamp(i['dt'])

    if (d.date() == usedDate.date()) :
        continue

    usedDate = d

    output += f'   {d.strftime('%A %B %d, %Y')}\n'
    output += f'      Weather:  {i['weather'][0]['main']}\n'
    output += f'      Ave Temp: {aves[count][0]}F\n'
    output += f'      Ave Wind: {aves[count][1]} mph\n'
    output += f'      Ave Gust: {aves[count][2]} mph\n'
    output += '\n'

    count += 1

print(output)