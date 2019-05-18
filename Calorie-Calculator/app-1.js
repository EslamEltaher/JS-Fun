function calc() {
    var weight      = document.getElementById("weight")      .value; console.log("weight      ,", weight      );
    var weightUnit  = document.getElementById("weightUnit")  .value; console.log("weightUnit  ,", weightUnit  );
    var height      = document.getElementById("height")      .value; console.log("height      ,", height      );
    var heightUnit  = document.getElementById("heightUnit")  .value; console.log("heightUnit  ,", heightUnit  );
    var age         = document.getElementById("age")         .value; console.log("age         ,", age         );
    var gender      = document.getElementById("gender")      .value; console.log("gender      ,", gender      );
    var activity    = document.getElementById("activity")    .value; console.log("activity    ,", activity    );

    if(weightUnit === "kg") { 
        console.log("weight is in kg");
        weight = convertWeightFromKG(weight);
    }
    
    if(heightUnit === "cm") { 
        console.log("height is in cm");
        height = convertHeightFromCm(height);
    }

    function convertWeightFromKG (weight) {
        return 2.2046226218 * weight;
    };

    function convertHeightFromCm(height) {
        return 0.3937007874 * height;
    };

    showSteps(weight, height, age, activity, gender);

    // try {
    //     calculator.enterData({
    //         weight: weight,
    //         height: height,
    //         age: age,
    //         gender: gender,
    //         activity: activity
    //     });
    // } catch (ex) {
    //     alert(ex.message);
    // }
    
}

function showSteps(weight, height, age, activity, gender) {
    var step1 = document.getElementById("step1");
    step1.style.visibility = "visible";
    
    document.getElementById("WeightView").innerText = parseFloat(weight).toFixed(2) + " lbs";
    document.getElementById("heightView").innerText = parseFloat(height).toFixed(2) + " in";

    /////////////////////

    var step2 = document.getElementById("step2");
    step2.style.visibility = "visible";
    document.getElementById("ageView").innerText = age;
    document.getElementById("activity-ratio").innerText = activity;

    var genderView, basalMetabolicEquation;
    if(gender === "0") {
        genderView = "male";
        basalMetabolicEquation = "({weight} * 6.23) + ({height} * 12.7) - ({age} * 6.8) + 66";

    } else if(gender === "1") {
        genderView = "female";
        basalMetabolicEquation = "({weight} * 4.35) + ({height} * 4.7) - ({age} * 4.7) + 655";

    } else {
        genderView = "error";
        basalMetabolicEquation = "error";
    }

    document.getElementById("genderView").innerText = genderView;
    document.getElementById("basal-metabolic-rate1").innerText = basalMetabolicEquation
    .replace("{weight}", "weight").replace("{height}", "height").replace("{age}", "age");

    var x = basalMetabolicEquation.replace("{weight}", weight).replace("{height}", height).replace("{age}", age);

    document.getElementById("basal-metabolic-rate2").innerText = x //basalMetabolicEquation

    var basalMetabolicRate = eval(x);
    document.getElementById("basal-metabolic-rate3").innerText = basalMetabolicRate //basalMetabolicEquation
    document.getElementById("basal-metabolic-rate4").innerText = basalMetabolicRate //basalMetabolicEquation
    document.getElementById("activity2").innerText = activity //basalMetabolicEquation

    document.getElementById("result").innerText = basalMetabolicRate * activity;

    //.replace("{weight}", weight).replace("{height}", height).replace("{age}", age);


    // document.getElementById("genderView").innerText = gender === "0" ? "male" : gender === "1" ? "female" : "error";
}