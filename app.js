// ==========================================================
// TRASH DUTY
// APP.JS
// ==========================================================


// ==========================================================
// CONFIGURATION
// ==========================================================

const members = [
    "Huy",
    "Lgont",
    "Jerry",
    "Hương",
    "Mì Béo"
];


/*
    Ngày bắt đầu:

    28/09/2026 = Huy

    JavaScript:
    tháng 9 = index 8
*/

const START_YEAR = 2026;
const START_MONTH = 8;
const START_DAY = 28;


/*
    Dùng UTC để tính khoảng cách ngày.

    Điều này tránh việc giờ trong ngày
    ảnh hưởng tới rotation.
*/

const START_DATE = Date.UTC(
    START_YEAR,
    START_MONTH,
    START_DAY
);


const ONE_DAY =
    24 * 60 * 60 * 1000;


// ==========================================================
// STATE
// ==========================================================

let currentViewDate =
    new Date();


// ==========================================================
// DOM
// ==========================================================

// Today

const todayDateElement =
    document.getElementById(
        "today-date"
    );

const todayPersonElement =
    document.getElementById(
        "today-person"
    );

const todayAvatarElement =
    document.getElementById(
        "today-avatar"
    );


// Calendar

const calendarTitle =
    document.getElementById(
        "calendar-title"
    );

const calendarElement =
    document.getElementById(
        "calendar"
    );

const prevMonthButton =
    document.getElementById(
        "prev-month"
    );

const nextMonthButton =
    document.getElementById(
        "next-month"
    );

const todayButton =
    document.getElementById(
        "today-btn"
    );


// Check

const checkButton =
    document.getElementById(
        "check-btn"
    );


// Modal

const modal =
    document.getElementById(
        "modal"
    );

const closeModalButton =
    document.getElementById(
        "close-modal"
    );

const understoodButton =
    document.getElementById(
        "understood-btn"
    );

const yesterdayPersonElement =
    document.getElementById(
        "yesterday-person"
    );

const yesterdayAvatarElement =
    document.getElementById(
        "yesterday-avatar"
    );

const yesterdayDateElement =
    document.getElementById(
        "yesterday-date"
    );


// ==========================================================
// CORE ROTATION LOGIC
// ==========================================================

function getPersonByDate(date) {

    /*
        Chuyển ngày cần kiểm tra
        thành UTC.
    */

    const targetDate =
        Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );


    /*
        Khoảng cách so với
        28/09/2026.
    */

    const daysPassed =
        Math.floor(
            (
                targetDate
                -
                START_DATE
            )
            /
            ONE_DAY
        );


    /*
        Trước 28/09/2026:

        chưa có hệ thống phân công.
    */

    if (daysPassed < 0) {

        return null;

    }


    /*
        Rotation:

        0 = Huy
        1 = Lgont
        2 = Jerry
        3 = Hương
        4 = Mì Béo
        5 = Huy
        ...
    */

    const index =
        daysPassed
        %
        members.length;


    return members[index];
}


// ==========================================================
// INITIAL
// ==========================================================

function getInitial(name) {

    if (!name) {

        return "—";

    }


    const words =
        name
            .trim()
            .split(" ");


    if (words.length >= 2) {

        return (
            words[0][0]
            +
            words[1][0]
        ).toUpperCase();

    }


    return name[0]
        .toUpperCase();
}


// ==========================================================
// DATE FORMAT
// ==========================================================

function formatFullDate(date) {

    return new Intl.DateTimeFormat(
        "vi-VN",
        {
            weekday:
                "long",

            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric"
        }
    ).format(date);

}


// ==========================================================
// SAME DATE
// ==========================================================

function isSameDate(
    dateA,
    dateB
) {

    return (

        dateA.getFullYear()
        ===
        dateB.getFullYear()

        &&

        dateA.getMonth()
        ===
        dateB.getMonth()

        &&

        dateA.getDate()
        ===
        dateB.getDate()

    );

}


// ==========================================================
// RENDER TODAY
// ==========================================================

function renderToday() {

    const today =
        new Date();


    const person =
        getPersonByDate(today);


    todayDateElement.textContent =
        formatFullDate(today);


    /*
        Nếu chưa tới ngày
        hệ thống bắt đầu.
    */

    if (person === null) {

        todayPersonElement.textContent =
            "Chưa bắt đầu";

        todayPersonElement.setAttribute(
            "data-text",
            "Chưa bắt đầu"
        );

        todayAvatarElement.textContent =
            "—";

        return;

    }


    /*
        Tên chính
    */

    todayPersonElement.textContent =
        person;


    /*
        data-text dùng cho
        lime outline animation.
    */

    todayPersonElement.setAttribute(
        "data-text",
        person
    );


    todayAvatarElement.textContent =
        getInitial(person);

}


// ==========================================================
// CALENDAR
// ==========================================================

function renderCalendar() {

    /*
        Reset month animation.
    */

    calendarElement.classList.remove(
        "month-enter"
    );


    calendarElement.innerHTML =
        "";


    const year =
        currentViewDate
            .getFullYear();


    const month =
        currentViewDate
            .getMonth();


    // ------------------------------------------------------
    // TITLE
    // ------------------------------------------------------

    calendarTitle.textContent =
        `Tháng ${month + 1} / ${year}`;


    // ------------------------------------------------------
    // FIRST DAY
    // ------------------------------------------------------

    const firstDay =
        new Date(
            year,
            month,
            1
        );


    // ------------------------------------------------------
    // NUMBER OF DAYS
    // ------------------------------------------------------

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    // ------------------------------------------------------
    // MONDAY-FIRST OFFSET
    // ------------------------------------------------------

    /*
        JS:

        CN = 0
        T2 = 1
        ...
        T7 = 6

        UI:

        T2 = column 0
        ...
        CN = column 6
    */

    const startOffset =
        (
            firstDay.getDay()
            +
            6
        )
        %
        7;


    // ------------------------------------------------------
    // EMPTY CELLS
    // ------------------------------------------------------

    for (
        let i = 0;
        i < startOffset;
        i++
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.classList.add(
            "calendar-day",
            "empty"
        );


        calendarElement
            .appendChild(
                empty
            );

    }


    // ------------------------------------------------------
    // TODAY
    // ------------------------------------------------------

    const today =
        new Date();


    // ------------------------------------------------------
    // DAYS
    // ------------------------------------------------------

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const date =
            new Date(
                year,
                month,
                day
            );


        const person =
            getPersonByDate(
                date
            );


        const dayElement =
            document.createElement(
                "div"
            );


        dayElement.classList.add(
            "calendar-day"
        );


        // Today

        if (
            isSameDate(
                date,
                today
            )
        ) {

            dayElement.classList.add(
                "today"
            );

        }


        // --------------------------------------------------
        // BEFORE START
        // --------------------------------------------------

        if (person === null) {

            dayElement.classList.add(
                "before-start"
            );


            dayElement.innerHTML = `

                <span class="date-number">
                    ${day}
                </span>

            `;

        }


        // --------------------------------------------------
        // ACTIVE ROTATION
        // --------------------------------------------------

        else {

            dayElement.innerHTML = `

                <span class="date-number">
                    ${day}
                </span>


                <div class="person">

                    <div class="person-avatar">
                        ${getInitial(person)}
                    </div>

                    <span>
                        ${person}
                    </span>

                </div>

            `;

        }


        calendarElement.appendChild(
            dayElement
        );

    }


    /*
        Restart calendar animation.

        Double requestAnimationFrame
        giúp browser nhận ra
        class đã bị remove trước đó.
    */

    requestAnimationFrame(
        function() {

            requestAnimationFrame(
                function() {

                    calendarElement
                        .classList
                        .add(
                            "month-enter"
                        );

                }
            );

        }
    );

}


// ==========================================================
// MONTH NAVIGATION
// ==========================================================

function previousMonth() {

    currentViewDate =
        new Date(
            currentViewDate
                .getFullYear(),

            currentViewDate
                .getMonth()
                -
                1,

            1
        );


    renderCalendar();

}


function nextMonth() {

    currentViewDate =
        new Date(
            currentViewDate
                .getFullYear(),

            currentViewDate
                .getMonth()
                +
                1,

            1
        );


    renderCalendar();

}


function goToToday() {

    currentViewDate =
        new Date();


    renderCalendar();

}


// ==========================================================
// CHECK YESTERDAY
// ==========================================================

function checkYesterday() {

    const yesterday =
        new Date();


    yesterday.setDate(
        yesterday.getDate()
        -
        1
    );


    const person =
        getPersonByDate(
            yesterday
        );


    yesterdayDateElement.textContent =
        formatFullDate(
            yesterday
        );


    /*
        Trước ngày hệ thống bắt đầu.
    */

    if (person === null) {

        yesterdayPersonElement.textContent =
            "Chưa có lịch";


        yesterdayAvatarElement.textContent =
            "—";


        openModal();

        return;

    }


    yesterdayPersonElement.textContent =
        person;


    yesterdayAvatarElement.textContent =
        getInitial(person);


    openModal();

}


// ==========================================================
// MODAL
// ==========================================================

function openModal() {

    modal.classList.add(
        "show"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    /*
        Ngăn background scroll
        khi modal đang mở.
    */

    document.body.style.overflow =
        "hidden";

}


function closeModal() {

    modal.classList.remove(
        "show"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


// ==========================================================
// SCROLL REVEAL
// ==========================================================

function initScrollReveal() {

    /*
        Những section này ban đầu
        đã có class .scroll-reveal
        trong HTML.
    */

    const sections =
        document.querySelectorAll(
            ".scroll-reveal"
        );


    /*
        IntersectionObserver:

        Browser tự theo dõi xem
        element có đi vào viewport không.

        Tốt hơn việc chạy scroll event
        liên tục.
    */

    const observer =
        new IntersectionObserver(

            function(entries) {

                entries.forEach(
                    function(entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target
                                .classList
                                .add(
                                    "visible"
                                );


                            /*
                                Chỉ chạy animation
                                một lần.
                            */

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },

            {

                /*
                    Khoảng 12% section
                    lọt vào màn hình.
                */

                threshold:
                    0.12,


                /*
                    Chờ section vào sâu
                    thêm một chút.
                */

                rootMargin:
                    "0px 0px -70px 0px"

            }

        );


    sections.forEach(
        function(section) {

            observer.observe(
                section
            );

        }
    );

}


// ==========================================================
// EVENTS
// ==========================================================

prevMonthButton.addEventListener(
    "click",
    previousMonth
);


nextMonthButton.addEventListener(
    "click",
    nextMonth
);


todayButton.addEventListener(
    "click",
    goToToday
);


checkButton.addEventListener(
    "click",
    checkYesterday
);


closeModalButton.addEventListener(
    "click",
    closeModal
);


understoodButton.addEventListener(
    "click",
    closeModal
);


// ----------------------------------------------------------
// CLICK OUTSIDE MODAL
// ----------------------------------------------------------

modal.addEventListener(
    "click",
    function(event) {

        if (
            event.target
            ===
            modal
        ) {

            closeModal();

        }

    }
);


// ----------------------------------------------------------
// ESC
// ----------------------------------------------------------

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key
            ===
            "Escape"

            &&

            modal.classList
                .contains(
                    "show"
                )
        ) {

            closeModal();

        }

    }
);


// ==========================================================
// START APPLICATION
// ==========================================================

renderToday();

renderCalendar();

initScrollReveal();