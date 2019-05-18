function calc() {
    var weight      = document.getElementById("weight")      .value; console.log("weight      ,", weight      );
    var weightUnit  = document.getElementById("weightUnit")  .value; console.log("weightUnit  ,", weightUnit  );
    var height      = document.getElementById("height")      .value; console.log("height      ,", height      );
    var heightUnit  = document.getElementById("heightUnit")  .value; console.log("heightUnit  ,", heightUnit  );
    var age         = document.getElementById("age")         .value; console.log("age         ,", age         );
    var gender      = document.getElementById("gender")      .value; console.log("gender      ,", gender      );
    var activity    = document.getElementById("activity")    .value; console.log("activity    ,", activity    );

    var calculator = new CalorieCalculator();
    try {

        if(weightUnit === "kg") { 
            console.log("weight is in kg");
            weight = converter.convertWeightFromKG(weight);
        }
        
        if(heightUnit === "cm") { 
            console.log("height is in cm");
            height = converter.convertHeightFromCm(height);
        }

        calculator.enterData({
            weight: weight,
            height: height,
            age: age,
            gender: gender,
            activity: activity
        });

        
    
        showSteps(weight, height, age, activity, calculator);
    } catch (ex) {
        alert(ex.message);
    }
}

function showSteps(weight, height, age, activity, calculator) {
    var step1 = document.getElementById("step1");
    step1.style.visibility = "visible";
    
    document.getElementById("WeightView").innerText = parseFloat(weight).toFixed(2) + " lbs";
    document.getElementById("heightView").innerText = parseFloat(height).toFixed(2) + " in";
    /////////////////////
    var step2 = document.getElementById("step2");
    step2.style.visibility = "visible";
    document.getElementById("ageView").innerText = age;
    document.getElementById("activity-ratio").innerText = activity;
    document.getElementById("genderView").innerText = calculator.getGenderText();

    
    document.getElementById("basal-metabolic-rate1").innerText = calculator.getBasalMetabolicEquation();
    document.getElementById("basal-metabolic-rate2").innerText = calculator.getBasalMetabolicEquation(true);

    var step3 = document.getElementById("step3");
    step3.style.visibility = "visible";

    var basalMetabolicRate = calculator.getBasalMetabolicRate();
    document.getElementById("basal-metabolic-rate3").innerText = basalMetabolicRate //basalMetabolicEquation
    document.getElementById("basal-metabolic-rate4").innerText = basalMetabolicRate //basalMetabolicEquation
    document.getElementById("activity2").innerText = activity //basalMetabolicEquation

    document.getElementById("result").innerText = calculator.getCalories();

    console.log("days: ", calculator.planDiet(198.41, 1000));
    //.replace("{weight}", weight).replace("{height}", height).replace("{age}", age);


    // document.getElementById("genderView").innerText = gender === "0" ? "male" : gender === "1" ? "female" : "error";
}

document.onreadystatechange =  UIStuff;

function UIStuff() {
    let i = 0;
    let colors = ['red', 'green', 'yellow'];

    for(let stepContainer of document.querySelectorAll('.stepContainer')) {
        stepContainer.style.textAlign = "center";
        stepContainer.querySelector('h1').style.backgroundColor = colors[ i++ % colors.length ];
    }
}