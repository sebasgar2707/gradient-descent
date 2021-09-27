//Iteraciones máximas para hacer la regresión lineal
const iterations = 5000;
//Threshold value
const tv = 0.515;
//Arrays donde se almacenan los datos
let xvalues = [];
let yvalues = [];
let xiterations = [];
let matrixdata = [];
let Jvalues = [];

//Valores inciales de m y b y=mx+b
let m =0;
let b =0;

//Función principal
//Gráfica
//Muestra los resultados finales
async function graph() {
    const TESTER = document.getElementById('tester');
    let useCSVAsData = window.prompt("Do you wish to use a predetermined CSV as your dataset? Write Yes or No");
    if(useCSVAsData=='Yes'){
        await getData();
    }
    if(useCSVAsData=='No'){
        await getxData();
        await getyData();
    }
    
    let data1 = [{
        x: xvalues,
        y: yvalues,
        mode: 'markers',
    }];
 
    let layout = {
        title:'Linear Regression by gradient descent',
        xaxis: {
        title: 'x-axis'
        },
        yaxis: {
        title: 'y-axis'
        }
    };

	Plotly.newPlot( TESTER,data1,layout );
    
    gradient(xvalues,yvalues,iterations);
    document.getElementById("m").innerHTML = m ;
    document.getElementById("b").innerHTML = b;
    const results2 = linear(m,b,xvalues);
    const LINEAR = document.getElementById('linear');

    let results34 = [];
    for(i = 0;i <2; i++)
    {
    let randomnumber=Math.floor(Math.random()*matrixdata.length)+1;
    results34.push(randomnumber);
    }
    console.log(results34)
    const results3 = getrow(results34[0]); //checar como automatizarlo 
    const results4 = getrow(results34[1]);

    let datatrue = {
        x: xvalues,
        y: yvalues,
        mode: 'markers',
        name: 'Original Points',
    };

    let data2 = {
        x: xvalues,
        y: results2 ,
        mode: 'lines',
        name: 'Best Fit',
    };

    let data3 = {
        x: xvalues,
        y: results3,
        mode: 'lines',
        name: `${results34[0]} iterations`,
    };

    let data4 = {
        x: xvalues,
        y: results4,
        mode: 'lines',
        name: `${results34[1]} iterations`,
    };

    let arrayData = [datatrue,data2,data3,data4];


    Plotly.newPlot(LINEAR,arrayData,layout);

    
    let Jdata = [{
        x: xiterations,
        y: Jvalues,
        mode: 'markers',
    }];

    let layout2 = {
        title:'Linear Regression by gradient descent',
        xaxis: {
        title: 'Iterations'
        },
        yaxis: {
        title: 'Cost Function'
        }
    };
    const COSTFUNC = document.getElementById('CostFunc');
    Plotly.newPlot(COSTFUNC,Jdata,layout2);


}
//Obtiene datos de un archivo csv
async function getData() {
        const response = await fetch('income.data.csv');
        const data = await response.text();

        const table = data.split('\n').slice(1);
        table.forEach(row => {
            const columns = row.split(',');
            const income = columns[1];
            xvalues.push(Number(income));
            const happiness = columns[2];
            yvalues.push(Number(happiness));
        });
}
//obtiene valores del usuario
//Dar Cancelar o escribir "Stop" para terminar
async function getxData(){
        while(true){
            let input = prompt("Add x values");
            if(input== "stop" || input ==null){
                break;
            }
            xvalues.push(Number(input));

        }
       
}
//obtiene valores del usuario
//Dar Cancelar o escribir "Stop" para terminar
async function getyData(){
        while(true){
            let input = prompt("Add y values");
            if(input== "stop" || input ==null){
                break;
            }
            yvalues.push(Number(input));

        }
        
        
}
//Algoritmo de gradien descente
//Modifica los valores de m y b , y de vuelve un arreglo de los valores que fue tomando y    
function gradient(datax,datay){
        const N = datax.length;
        let ynew = Array(N);
        let Error = Array(N);
        let J =0;
        
        let Lr = 0.001;  //Learning Rate

        for (let k = 0; k < iterations; k++) {
            matrixdata[k]=[];
            let deltam = 0;
            for (let i=0; i < N;i++){
                ynew[i]= (m*datax[i]) + b;
                Error[i] = ynew[i]-datay[i];
                deltam = deltam + (Error[i]*datax[i]);
                matrixdata[k][i]=ynew[i];
            }
            m = m - ((1/N)* deltam)*Lr;
            b = b - arrayAverage(Error)*Lr;
            J=arrayAverage(multArray(Error));
            xiterations.push(k);
            Jvalues.push(J);
            if(J<tv){
                break;
            }
            
        } 
}
    
//Saca el promedio de numeros de un arreglo
function arrayAverage(arr){
    let sum = 0;
    for(let i in arr) {
        sum += arr[i];
    }
    let numbersCnt = arr.length;
    return (sum / numbersCnt);
}
//Calcular los valores de cierta función
function linear(m,b,xvalues){
    const N = xvalues.length;
    ylinear = Array(N);
    for (let i=0;i < N; i++ ){
        ylinear[i]= (m*xvalues[i])+b;
    }
    return ylinear;
}

//Obtiene columnas de una matriz
function getrow(row){
    let fila = [];
    fila = matrixdata[row];
    return fila;
}
//Multiplicación de arrays
function multArray(arr){
    let result = Array(arr.length);
    for(let i in arr){
        result[i]=arr[i]*arr[i];
    }
    return result;
}
//Obtener una imagen
async function getImage(){
    const response = await fetch('Cost.jpg');
    const blob = await response.blob();
    document.getElementById('Cost').src = URL.createObjectURL(blob);
}