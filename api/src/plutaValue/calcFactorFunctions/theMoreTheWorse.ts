// values have to be between 0 and 100
export default function calcTheMoreTheWorseFactor(weatherCode:number){
    return (100 - weatherCode) / 100
}