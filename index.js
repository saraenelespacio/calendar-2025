
const DAY = 1000 * 60 * 60 * 24;
const WEEKDAYS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const IMG_WIDTH = 596 + 16
const IMG_HEIGHT = 842.5 + 16

window.onload = async () => {
    resize();


    if (new Date().getFullYear() !== 2025) {
        await loopingThroughDays();
        return;
    }

    const date = new Date();

    let label = getLabel(date);
    let matchingDay = getDateFromMonthAndLabel(date.getMonth() + 1, label);
    attachClassToElement(matchingDay, 'current_date', label)

    setInterval(() => {
        const newLabel = getLabel(date);
        if (label !== newLabel) {
            removeClassFromElement(matchingDay, 'current_date');
            label = newLabel;
            matchingDay = getDateFromMonthAndLabel(date.getMonth() + 1, label);
            attachClassToElement(matchingDay, 'current_date', label)
        }
    }, 1000);

}

window.onresize = () => resize()

function resize() {
    {
        const windowRatio = window.innerWidth / window.innerHeight;
        const imgRatio = IMG_WIDTH / IMG_HEIGHT;

        document.body.style.zoom = windowRatio > imgRatio
            ? window.innerHeight / IMG_HEIGHT
            : window.innerWidth / IMG_WIDTH;

    }
}

async function loopingThroughDays() {
    const dayLabels = getEveryDayOfTheYear();

    while (true) {
        for (const [_, { month, label }] of Object.entries(dayLabels)) {
            const matchingDay = getDateFromMonthAndLabel(month, label);
            attachClassToElement(matchingDay, 'current_date', label)
            await wait(20);
            removeClassFromElement(matchingDay, 'current_date');
        }
    }
}

function getEveryDayOfTheYear(year = 2025) {
    const day1 = new Date(`${year}-01-01`).getTime();

    const result = {}

    for (let i = 0; i < 365; i++) {
        const day = new Date(day1 + DAY * i);
        const number = day.getDate() > 9 ? day.getDate() : `0${day.getDate()}`;
        const weekDay = WEEKDAYS[day.getDay()];
        result[i] = { month: day.getMonth() + 1, label: weekDay + number };
    }
    return result;
}

function getDateFromMonthAndLabel(month, label) {
    const monthContainer = document.querySelector(`[month="${month}"]`);
    const monthDays = Array.from(monthContainer.getElementsByClassName('day'))
    const matchingDay = monthDays.find(day => day.textContent === label);
    return matchingDay;
}

function getLabel(date) {
    const number = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    const weekDay = WEEKDAYS[date.getDay()];
    return weekDay + number;
}

function attachClassToElement(element, className, label) {
    element.setAttribute('data-label', label);
    element.classList.add(className);
    return element;
}

function removeClassFromElement(element, className) {
    element.classList.remove(className);
    return element;
}

function wait(msec) {
    return new Promise(resolve => {
        setTimeout(resolve, msec);
    });
}
