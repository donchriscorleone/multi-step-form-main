let stepNumber = 1;

const stepperNumberButtons = document.querySelectorAll('button[data-type="stepper"]');
const btnNext = document.querySelector('button.btn-next');
const btnPrev = document.querySelector('button.btn-prev');
const btnSubmit = document.querySelector('button.btn-submit');
const steps = document.querySelectorAll('section.step');
const form = document.querySelector('form.form');
const formActions = document.querySelector('.form-actions');

// Step 1
const inputs = document.querySelectorAll('.form-field > input')
inputs.forEach(i => {
    i.addEventListener('keyup', (e) => {
        console.warn(e.target.value, i.value);
        if (i.value == '') {
            i.parentElement.classList.add('form-field-error');
        } else {
            i.parentElement.classList.remove('form-field-error');
        }
    })
})

// Step 2
let selectedPlan = "";
let isMonthly = true;
const plansObj = {
    "arcade": {
        "monthly": {
            "price": 9,
        },
        "yearly": {
            "price": 90,
        }
    }, 
    "advanced": {
        "monthly": {
            "price": 12,
        },
        "yearly": {
            "price": 120,
        }
    },
    "pro": {
        "monthly": {
            "price": 15,
        },
        "yearly": {
            "price": 150,
        }
    }
}
const toggle = document.getElementById('toggle');
const switcherLabels = document.querySelectorAll('.switcher-label');
const plans = document.querySelectorAll('button.plan');
const plansPrice = [];
plans.forEach(p => {
    plansPrice.push(p.querySelector('.plan-price'));

    p.addEventListener('click', (e) => {
        selectedPlan = p.getAttribute('data-value');
        p.classList.add('selected');
        changePreviewTitleAndPrice(selectedPlan, p.querySelector('.plan-price').innerHTML)

        plans.forEach(x => {
            if (x != p) x.classList.remove('selected');
        })
    })
})
toggle.addEventListener('click', (e) => {
    isMonthly = !isMonthly;
    plansPrice.forEach((p, index) => {
        let obj = plansObj[p.getAttribute('data-priceOf')];
        p.innerHTML = isMonthly ? `$${obj.monthly.price}/mo` : `$${obj.yearly.price}/yr`
        !isMonthly ? plans.item(index).classList.add('plan-yearly') : plans.item(index).classList.remove('plan-yearly');
    })

    changeAddonsPrice();
})

// Step 3
const addons = document.querySelectorAll('.addon');
const defaultAddons = [
    {'addon': 'Online Service', 'price': {'yearly': 20, 'monthly': 2}},
    {'addon': 'Larger Storage', 'price': {'yearly': 20, 'monthly': 2}},
    {'addon': 'Custom Profile', 'price': {'yearly': 20, 'monthly': 2}}
]
const selectedAddons = {};
const checkboxes = [];
addons.forEach((a, index) => {
    checkboxes.push(a.querySelector('input'));
    changeAddonsPrice();

    a.addEventListener('click', (e) => {
        checkboxes[index].checked = !checkboxes[index].checked;
        a.classList.toggle('selected');

        let obj = defaultAddons[a.getAttribute('data-index')];
        const {yearly, monthly} = obj.price;
        if (checkboxes[index].checked) {
            selectedAddons[index] = obj; 
            addPreviewListItem(obj.addon, isMonthly ? monthly : yearly);
            updatePrice(isMonthly ? monthly : yearly)
        } else {
            removePreviewListItem(obj.addon)
            updatePrice(isMonthly ? -monthly : -yearly);

            delete selectedAddons[index];
        }

    })
})

function changeAddonsPrice() {
    addons.forEach((a, index) => {
        const addonPrice = a.querySelector('.addon-price');
        const {yearly, monthly} = defaultAddons[index].price;
    
        addonPrice.innerHTML = `+$${isMonthly ? monthly : yearly}/${isMonthly ? 'mo' : 'yr'}`;
    })
}

// Step 4
const previewTitle = document.querySelector('.preview-title');
const previewPlanPrice = document.querySelector('.preview-plan-price');
const previewList = document.querySelector('ul.preview-list');
const previews = {};
const previewTotalPriceEl = document.querySelector('.preview-total-price');
let total = 0;

function changePreviewTitleAndPrice(title, price) {
    previewTitle.innerHTML = `${title} (${isMonthly ? 'Monthly' : 'Yearly'})`;
    previewPlanPrice.innerHTML = `${price}`;
}

function addPreviewListItem(title, price) {
    const li = document.createElement('li');
    li.classList.add('preview-list__item');

    const itemTitle = document.createElement('span');
    itemTitle.classList.add('list-title', 'color-cool-gray');
    itemTitle.innerHTML = title;

    const itemPrice = document.createElement('span');
    itemPrice.classList.add('list-price', 'color-marine-blue');
    itemPrice.innerHTML = `+$${price}/${isMonthly ? 'mo' : 'yr'}`;

    li.appendChild(itemTitle);
    li.appendChild(itemPrice);
    previewList.appendChild(li);
    updatePrice(price);

    previews[Object.keys(previews).length] = li;
}

function removePreviewListItem(title) {
    const children = previewList.children;
    for(let i=0; i<children.length; i++){
        const child = children[i];
        const currentTitle = child.querySelector('.list-title');
        if (currentTitle.innerHTML == title) {
            previewList.removeChild(child);
        }
    }
}

function updatePrice(price) {
    total+= price;
    previewTotalPriceEl.innerHTML = `+$${total}/${isMonthly ? 'mo' : 'yr'}`
}


// Buttons

btnNext.addEventListener('click', (e) => {
    stepNumber++;
    showActiveStep();
})

btnPrev.addEventListener('click', (e) => {
    stepNumber--;
    if (stepNumber == 0)
        stepNumber = 4;
    showActiveStep();
})

window.addEventListener('load', (e) => {
    if (stepNumber == 1) btnPrev.classList.add('sr-only');
    showActiveStep();

    console.warn(steps);
});

const stepsContainer = document.querySelector('div.steps-container');
btnSubmit.addEventListener('click', (e) => {
    stepNumber++;
    stepsContainer.classList.add('thank-you');

    showActiveStep();
    e.preventDefault();
})



function showActiveStep() {
    showFormActions();
    steps.forEach((step, index) => {
        if (stepNumber == index + 1) {
            step.classList.remove('sr-only');
            step.classList.add('active');
        } else {
            step.classList.add('sr-only');
            step.classList.remove('active');
        }
    })
    stepperNumberButtons.forEach((b, index) => {
        if (stepNumber == index + 1 || (stepNumber == 5 && index == 3)) {
            b.classList.add('active');
        } else {
            b.classList.remove('active');
        }
    })
}

function showFormActions() {
    if (stepNumber == 1 || stepNumber == 5) btnPrev.classList.add('sr-only');
    else btnPrev.classList.remove('sr-only');

    if (stepNumber == 4 || stepNumber == 5) {
        btnNext.classList.add('sr-only');
        btnSubmit.classList.remove('sr-only');
    }
    else {
        btnNext.classList.remove('sr-only');
        btnSubmit.classList.add('sr-only');
    }

    if (stepNumber == 5)
        btnSubmit.classList.add('sr-only')
}