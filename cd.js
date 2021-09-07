//Iteraciones para hacer la regresión lineal
const iterations = 5000;
//Arrays donde se almacenan los datos
let xvalues = [];
let yvalues = [];
let J = Array(iterations);
let xiterations = Array(iterations);

//Valores inciales de m y b y=mx+b
let m =0;
let b =0;

//Función principal
//Gráfica
//Muestra los resultados finales
async function graph() {
    const TESTER = document.getElementById('tester');
    //await getData();
    await getxData();
    await getyData();
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
    
    let matrixdata = new Array(xvalues.length).fill(0).map(() => new Array(iterations).fill(0));
    
    matrixdata = gradient(xvalues,yvalues,iterations);
   

    document.getElementById("m").innerHTML = m ;
    document.getElementById("b").innerHTML = b;
    const results2 = linear(m,b,xvalues);
    const LINEAR = document.getElementById('linear');
    const results3 = getCol(matrixdata,10);
    const results4 = getCol(matrixdata,800);

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
        name: '10 iterations',
    };

    let data4 = {
        x: xvalues,
        y: results4,
        mode: 'lines',
        name: '800 iterations',
    };

    let arrayData = [datatrue,data2,data3,data4];


    Plotly.newPlot(LINEAR,arrayData,layout);
    console.log(J);

    let Jdata = [{
        x: xiterations,
        y: J,
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
        let matrix = new Array(N).fill(0).map(() => new Array(iterations).fill(0));
        let ynew = Array(N);
        let Error = Array(N);
        
        let Lr = 0.001;  //Learning Rate

        for (let k = 0; k < iterations; k++) {
        
            let deltam = 0;
            for (let i=0; i < N;i++){
                ynew[i]= (m*datax[i]) + b;
                Error[i] = ynew[i]-datay[i];
                deltam = deltam + (Error[i]*datax[i]);
                matrix[i][k]=ynew[i];
            }

            m = m - ((1/N)* deltam)*Lr;
            b = b - arrayAverage(Error)*Lr;
            J[k] =arrayAverage(multArray(Error));
            xiterations[k]= k;
            

            
        } 
        return matrix;
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
function getCol(matrix,col){
    let column = [];
    for(let i=0; i<matrix.length;i++){
        column.push(matrix[i][col]);
    }
    return column;
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