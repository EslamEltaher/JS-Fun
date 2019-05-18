// (function(global){

    var maleBasalMetabolicEquation      = "({weight} * 6.23) + ({height} * 12.7) - ({age} * 6.8) + 66";
    var femaleBasalMetabolicEquation    = "({weight} * 4.35) + ({height} * 4.7) - ({age} * 4.7) + 655";
    function getMaleMetabolicRate({weight, height, age}) {      return (weight * 6.23) + (height * 12.7) - (age * 6.8) + 66; }
    function getFemaleMetabolicRate({weight, height, age}) {    return (weight * 4.35) + (height * 4.7) - (age * 4.7) + 655; }

    var CalorieCalculator = function(){};

    CalorieCalculator.prototype.enterData = function(personData) {
        this.personData = new PersonData(personData);
    };
    CalorieCalculator.prototype.getGenderText = function() { return this.personData.getGenderText(); };
    CalorieCalculator.prototype.getBasalMetabolicEquation = function(dataReplaced) {
        var equation = this.personData.isFemale ? femaleBasalMetabolicEquation : maleBasalMetabolicEquation;
        
        var weight  = "weight";
        var height  = "height";
        var age     =   "age";

        if(dataReplaced) {
            weight  = this.personData.weight;
            height  = this.personData.height;
            age     = this.personData.age;
        }

        return equation
            .replace("{weight}",    weight)
            .replace("{height}",    height)
            .replace("{age}",       age);

    };
    CalorieCalculator.prototype.getBasalMetabolicRate = function() {
        return this.personData.isFemale ? getFemaleMetabolicRate(this.personData) : getMaleMetabolicRate(this.personData);
    };
    CalorieCalculator.prototype.getCalories = function() {
        return this.getBasalMetabolicRate() * this.personData.activity;
    };

    CalorieCalculator.prototype.planDiet = function(desiredWeight, desiredCalorieIntake) {
        var height = this.personData.height;
        var age = this.personData.age;
        var currentWeight = this.personData.weight;

        var days = [];

        do {
            var obj = { weight: currentWeight, height, age }
            var metabolicRate = this.personData.isFemale ? getFemaleMetabolicRate(obj) : getMaleMetabolicRate(obj);
            var dailyCalories = metabolicRate * this.personData.activity;
            var calorieDiff = dailyCalories - desiredCalorieIntake;

            console.log("currentWeight: ", currentWeight, ", dailyCalories: ", dailyCalories, ", calorieDiff: ", calorieDiff);

            if(calorieDiff > 500) {
                currentWeight = currentWeight - (calorieDiff / 3500);
                days.push(currentWeight)
            }
        } while (calorieDiff > 500 && currentWeight > desiredWeight);

        var numbers = [];

        var number = Math.floor(days[0]);
        var count = 0;
        for(var i of days) {
            
            if(Math.floor(i) < number - 1) {
                numbers.push({ number, count });
                number = Math.floor(i);
                count = 0;
            }
            count++;
        }

        console.log(numbers);

        return days;
        // var obj = { weight: currentWeight, height, age }
        // var metabolicRate = this.personData.isFemale ? getFemaleMetabolicRate(obj) : getMaleMetabolicRate(obj);
        // var dailyCalories = metabolicRate * this.personData.activity;

        // var calorieDiff = dailyCalories - desiredCalorieIntake;
        // if(calorieDiff > 0) {
        //     currentWeight = currentWeight - (calorieDiff / 3500);
        //     days.push(currentWeight)
        // }
    };

    CalorieCalculator.prototype.simulateDay = function() {

    };

    

    var calc = new CalorieCalculator();

    function PersonData({weight, height, age, gender, activity}) {
        if(!weight || !height || !age || !activity) {
            throw Error((!weight ? "weight" : !height ? "height" : !age ? "age" : !activity ? "activity" : "something") + " is missing");
        };
        
        this.weight     = weight;
        this.height     = height;
        this.age        = age;
        this.isFemale   = gender === "1";
        this.activity   = activity;
    }

    PersonData.prototype.getGenderText = function() {
        return this.isFemale ? "female" : "male";
    }

    
    function convertWeightFromKG(weight) { return 2.2046226218 * weight; };
    function convertHeightFromCm(height) { return 0.3937007874 * height; };

    window.CalorieCalculator = CalorieCalculator;
    window.converter = { convertHeightFromCm, convertWeightFromKG };

// }(window));