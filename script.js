// Calculator functionality
$(document).ready(function() {
    // Enable/disable PT sessions based on checkbox
    $('#personalTraining').change(function() {
        $('#ptSessions').prop('disabled', !this.checked);
        if (!this.checked) {
            $('#ptSessions').val('0');
        }
    });

    // Membership calculation
    $('#calculateBtn').click(function() {
        calculateMembership();
    });

    // BMI calculation
    $('#calculateBmiBtn').click(function() {
        calculateBMI();
    });

    // Weight class validation on weight input change
    $('#weight').on('input', function() {
        validateWeightClass();
    });

    // Weight class selection change
    $('#weightClass').change(function() {
        validateWeightClass();
    });
});

function calculateMembership() {
    const membershipType = $('#membershipType').val();
    const contractDuration = parseInt($('#contractDuration').val());
    const numberOfPeople = parseInt($('#numberOfPeople').val());
    const ptSessions = parseInt($('#ptSessions').val()) || 0;

    if (!membershipType || !contractDuration) {
        alert('Please select membership type and contract duration');
        return;
    }

    // Base prices
    const prices = {
        'basic': 80,
        'premium': 120,
        'elite': 150,
        'family': 250
    };

    // Discounts based on contract duration
    const discounts = {
        '1': 0,
        '3': 0.05,
        '6': 0.10,
        '12': 0.15
    };

    const basePrice = prices[membershipType];
    const discount = discounts[contractDuration];
    const monthlyCost = basePrice * (1 - discount);
    const ptCost = ptSessions * 50;
    const totalCost = (monthlyCost * contractDuration * numberOfPeople) + ptCost;

    // Display results
    $('#monthlyCost').text('$' + monthlyCost.toFixed(2));
    $('#totalDuration').text(contractDuration + ' months');
    $('#ptCost').text('$' + ptCost.toFixed(2));
    $('#totalCost').text('$' + totalCost.toFixed(2));
    $('#resultsContainer').removeClass('hidden');
}

function calculateBMI() {
    const height = parseFloat($('#height').val());
    const weight = parseFloat($('#weight').val());
    const selectedWeightClass = $('#weightClass').val();

    if (!height || !weight) {
        alert('Please enter both height and weight');
        return;
    }

    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    // Determine BMI category
    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal weight';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    // Display BMI results
    $('#bmiValue').text(bmi.toFixed(2));
    $('#bmiCategory').text(category);
    
    // Validate and suggest weight class
    validateWeightClass();
    
    $('#bmiResultsContainer').removeClass('hidden');
}

function validateWeightClass() {
    const weight = parseFloat($('#weight').val());
    const selectedWeightClass = $('#weightClass').val();
    
    if (!weight) return;

    // Weight class ranges (in kg)
    const weightClasses = {
        'flyweight': { min: 0, max: 57 },
        'bantamweight': { min: 57.1, max: 63 },
        'featherweight': { min: 63.1, max: 70 },
        'lightweight': { min: 70.1, max: 77 },
        'welterweight': { min: 77.1, max: 84 },
        'middleweight': { min: 84.1, max: 93 },
        'lightheavy': { min: 93.1, max: 105 },
        'heavyweight': { min: 105.1, max: Infinity }
    };

    // Find appropriate weight class
    let suggestedClass = '';
    for (const [className, range] of Object.entries(weightClasses)) {
        if (weight >= range.min && weight <= range.max) {
            suggestedClass = className;
            break;
        }
    }

    // Format class name for display
    const formatClassName = (className) => {
        return className.charAt(0).toUpperCase() + className.slice(1);
    };

    // Check if selected class is appropriate
    if (selectedWeightClass) {
        const selectedRange = weightClasses[selectedWeightClass];
        if (weight < selectedRange.min || weight > selectedRange.max) {
            $('#suggestedWeightClass').html(
                '<span style="color: #ff2f9c;">Not suitable. Suggested: ' + 
                formatClassName(suggestedClass) + ' (' + 
                weightClasses[suggestedClass].min + ' - ' + 
                (weightClasses[suggestedClass].max === Infinity ? '+' : weightClasses[suggestedClass].max) + 
                ' kg)</span>'
            );
        } else {
            $('#suggestedWeightClass').text(formatClassName(selectedWeightClass));
        }
    } else {
        $('#suggestedWeightClass').text(
            formatClassName(suggestedClass) + ' (' + 
            weightClasses[suggestedClass].min + ' - ' + 
            (weightClasses[suggestedClass].max === Infinity ? '+' : weightClasses[suggestedClass].max) + 
            ' kg)'
        );
    }
}

// Utility function to show/hide elements
$.fn.extend({
    toggle: function(state) {
        return state ? this.show() : this.hide();
    }
});
