class ResumeList {
    constructor(resumeArr) {
        this.resumeNo = 0;
        this.resumes = resumeArr;
    }

    resumeNumber() {
        return this.resumeNo;
    }

    isEnded(resumes) {
        return this.resumeNo >= resumes.length - 1;
    }

    isStart() {
        return this.resumeNo == 0;
    }

    updateResumeNo(actionType) {
        actionType == "plus" ? this.resumeNo++ : this.resumeNo--;
        if (this.resumeNo < 0) {
            this.resumeNo = 0;
        }
    }

    resetResumeNo() {
        this.resumeNo = 0;
    }
}

let resumeList;
const back_btn = document.querySelector('.back-btn');
const next_btn = document.querySelector('.next-btn');
const inputEle = document.getElementById("search");
const error_container = document.querySelector('.error-container');
const resume_container = document.querySelector('.resume-box');

inputEle.addEventListener("keypress", function () {
    if (event.keyCode == 13) {
        getSearchList(inputEle.value);
    }
});

window.addEventListener("load", function () {
    fetch("../assets/Data.json")
        .then(response => response.json())
        .then(data => {
            resumeList = new ResumeList(data.resume);
            this.sessionStorage.setItem('initial_resume_list', JSON.stringify(resumeList.resumes));
            displayResumes();
        });
});

window.addEventListener("resize", setHeightFunction());

back_btn.addEventListener('click', function () {
    resumeList.updateResumeNo("minus");
    displayResumes();
});

next_btn.addEventListener('click', function () {
    resumeList.updateResumeNo("plus");
    displayResumes();
});

setHeightFunction();

function setHeightFunction() {
    const resume_box = document.getElementById('resume-box');
    const contentHeight = resume_box.scrollHeight + 15;
    // Set the height of the element
    resume_box.style.height = `${contentHeight}px`;
}

function displayResumes() {
    resumeArr = resumeList.resumes;
    setHeightFunction();
    error_container.style.display = 'none';
    resume_container.style.display = 'block';
    if (resumeArr.length > 0) {
        if (resumeList.isEnded(resumeArr)) {
            next_btn.style.display = 'none';
            back_btn.style.display = 'block';
        } else if (resumeList.isStart()) {
            back_btn.style.display = 'none';
            next_btn.style.display = 'block';
        }
        else {
            back_btn.style.display = 'block';
            next_btn.style.display = 'block';
        }
        displayCurrentResume(resumeArr[resumeList.resumeNumber()]);
    }
}

function displayCurrentResume(resume) {
    let ele = queryForElements();
    let { basics, skills, work, Internship, projects, education, achievements, interests } = resume;
    removeElementIfExists();
    insertData(ele.name, basics.name);
    insertData(ele.AppliedFor, basics.AppliedFor);
    insertData(ele.phone, basics.phone);
    insertData(ele.email, basics.email);
    insertData(ele.work_company, work["Company Name"]);
    insertData(ele.work_position, work.Position);
    insertData(ele.work_start, work["Start Date"]);
    insertData(ele.work_end, work["End Date"]);
    insertData(ele.work_summary, work.Summary);
    insertData(ele.project_name, `${projects.name}:`);
    insertData(ele.network, basics.profiles.network);
    createList(ele.skills, skills.keywords);
    createList(ele.hobbies, interests.hobbies);
    createAndUpdateSpan(ele.project_name, projects.description);
    displayEducationDetails(ele.education, education);
    insertData(ele.internship_company, Internship["Company Name"]);
    insertData(ele.internship_position, Internship.Position);
    insertData(ele.internship_start, Internship["Start Date"]);
    insertData(ele.internship_end, Internship["End Date"]);
    insertData(ele.internship_summary, Internship.Summary);
    createList(ele.achivements_list, achievements.Summary);
    customSetAttribute(ele.network, "href", basics.profiles.url);
    customSetAttribute(ele.achivements_list, "class", 'achivements sub-title information-span');
}

function insertData(element, data) {
    element.innerHTML = data;
}

function createList(ele, details) {
    for (let index = 0; index < details.length; index++) {
        const liEle = document.createElement('li');
        customSetAttribute(liEle, 'class', 'list-element');
        liEle.textContent = details[index];
        ele.appendChild(liEle);
    }
}

function displayEducationDetails(ele, education) {
    Object.keys(education).forEach((course) => {
        let edDetails = education[course];
        const li = document.createElement('li');
        const text = document.createTextNode(course + ":");
        customSetAttribute(li, 'class', 'sub-title list-element');
        li.appendChild(text);
        createAndUpdateSpan(li, createEducationDetailsString(edDetails));
        ele.appendChild(li);
    });

}

function customSetAttribute(element, property, value) {
    element.setAttribute(property, value);
}

function createEducationDetailsString(edDetails) {
    let value = "";
    Object.keys(edDetails).forEach((detail) => {
        if (detail === "cgpa") {
            value += ` ${edDetails[detail]}`;
        } else {
            value += ` ${edDetails[detail]},`;
        }
    })
    return value;
}

function createAndUpdateSpan(ele, info) {
    const span_ele = document.createElement('span');
    customSetAttribute(span_ele, 'style', ' font-weight: normal');
    span_ele.innerHTML = info;
    ele.appendChild(span_ele);
}

function queryForElements() {
    let elements = {};
    elements.name = document.querySelector('.name');
    elements.AppliedFor = document.querySelector('.AppliedFor');
    elements.phone = document.querySelector('.phone');
    elements.email = document.querySelector('.email');
    elements.network = document.querySelector('.network');
    elements.skills = document.querySelector('.skills');
    elements.hobbies = document.querySelector('.hobbies');
    elements.work_company = document.querySelector('.work-company');
    elements.work_position = document.querySelector('.work-position');
    elements.work_start = document.querySelector('.work-start');
    elements.work_end = document.querySelector('.work-end');
    elements.work_summary = document.querySelector('.work-summary');
    elements.project_name = document.querySelector('.project-name');
    elements.education = document.querySelector('.education');
    elements.internship_company = document.querySelector('.internship-company');
    elements.internship_position = document.querySelector('.internship-position');
    elements.internship_start = document.querySelector('.internship-start');
    elements.internship_end = document.querySelector('.internship-end');
    elements.internship_summary = document.querySelector('.internship-summary');
    elements.achivements_list = document.querySelector('.achivements');
    return elements;
}

function removeElementIfExists() {
    let items = document.querySelectorAll('.list-element');
    if (items) {
        items.forEach(item => {
            item.remove();
        });
    }
}

function getSearchList(searchVal) {
    var initialResumeList = JSON.parse(sessionStorage.getItem('initial_resume_list'));
    resumeList.resetResumeNo();
    let resultsArray = [];
    initialResumeList.find(item => {
        if ((item.basics.AppliedFor.toLowerCase()).includes(searchVal.toLowerCase())) {
            resultsArray.push(item);
        }
    });
    if (resultsArray.length > 0) {
        resumeList.resumes = resultsArray;
        resumeList.resetResumeNo();
        displayResumes();
    } else {
        back_btn.style.display = 'none';
        next_btn.style.display = 'none';
        error_container.style.display = 'block';
        resume_container.style.display = 'none';
    }
}