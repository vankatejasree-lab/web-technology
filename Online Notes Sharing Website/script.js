// ==================================================
// ONLINE NOTES SHARING WEBSITE
// ==================================================


// Default Notes
let notes = [

    {
        id: 1,
        title: "Computer Science Fundamentals",
        subject: "Computer Science",
        description:
            "Important concepts and fundamentals of computer science.",
        icon: "💻"
    },

    {
        id: 2,
        title: "Cloud Computing Unit 1",
        subject: "Cloud Computing",
        description:
            "Cloud service models, deployment models and virtualization.",
        icon: "☁️"
    },

    {
        id: 3,
        title: "Data Science Notes",
        subject: "Data Science",
        description:
            "Python, NumPy, Pandas and basic machine learning concepts.",
        icon: "📊"
    },

    {
        id: 4,
        title: "DBMS Complete Notes",
        subject: "DBMS",
        description:
            "SQL, keys, normalization, transactions and database concepts.",
        icon: "🗄️"
    },

    {
        id: 5,
        title: "Operating Systems",
        subject: "Operating Systems",
        description:
            "Processes, threads, scheduling and memory management.",
        icon: "⚙️"
    },

    {
        id: 6,
        title: "Java Programming",
        subject: "Java",
        description:
            "Java basics, OOP concepts, exception handling and collections.",
        icon: "☕"
    },

    {
        id: 7,
        title: "Python Programming",
        subject: "Python",
        description:
            "Python syntax, functions, lists, dictionaries and OOP.",
        icon: "🐍"
    }

];


// Load uploaded notes from localStorage

const savedNotes =
    JSON.parse(
        localStorage.getItem("uploadedNotes")
    ) || [];


// Add saved notes

notes = [...notes, ...savedNotes];


// Get HTML Elements

const notesContainer =
    document.getElementById("notesContainer");

const searchInput =
    document.getElementById("searchInput");

const subjectFilter =
    document.getElementById("subjectFilter");

const noResults =
    document.getElementById("noResults");

const uploadForm =
    document.getElementById("uploadForm");

const uploadMessage =
    document.getElementById("uploadMessage");


// ==================================================
// DISPLAY NOTES
// ==================================================

function displayNotes() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();

    const selectedSubject =
        subjectFilter.value;


    const filteredNotes =
        notes.filter(note => {

            const matchesSearch =
                note.title
                    .toLowerCase()
                    .includes(searchText)
                ||
                note.description
                    .toLowerCase()
                    .includes(searchText)
                ||
                note.subject
                    .toLowerCase()
                    .includes(searchText);


            const matchesSubject =
                selectedSubject === "all"
                ||
                note.subject === selectedSubject;


            return matchesSearch && matchesSubject;

        });


    notesContainer.innerHTML = "";


    if (filteredNotes.length === 0) {

        noResults.style.display = "block";

        return;

    }


    noResults.style.display = "none";


    filteredNotes.forEach(note => {

        const card =
            document.createElement("div");

        card.className = "note-card";


        card.innerHTML = `

            <div class="note-icon">
                ${note.icon || "📄"}
            </div>

            <h3>
                ${note.title}
            </h3>

            <p>
                ${note.description}
            </p>

            <span class="subject-tag">
                ${note.subject}
            </span>

            <div class="note-actions">

                ${note.fileData
                ?
                `
                    <button
                        class="view-btn"
                        onclick="downloadNote(${note.id})"
                    >
                        📥 Download
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteNote(${note.id})"
                    >
                        🗑️ Delete
                    </button>
                    `
                :
                `
                    <button
                        class="view-btn"
                        onclick="showDemoMessage()"
                    >
                        📖 View Notes
                    </button>
                    `
            }

            </div>

        `;


        notesContainer.appendChild(card);

    });

}


// ==================================================
// SEARCH
// ==================================================

searchInput.addEventListener(
    "input",
    displayNotes
);


// ==================================================
// SUBJECT FILTER
// ==================================================

subjectFilter.addEventListener(
    "change",
    displayNotes
);


// ==================================================
// UPLOAD NOTES
// ==================================================

uploadForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const title =
            document.getElementById(
                "noteTitle"
            ).value.trim();


        const subject =
            document.getElementById(
                "noteSubject"
            ).value;


        const description =
            document.getElementById(
                "noteDescription"
            ).value.trim();


        const file =
            document.getElementById(
                "noteFile"
            ).files[0];


        if (!file) {

            alert(
                "Please select a notes file."
            );

            return;

        }


        // Maximum file size: 5 MB

        if (
            file.size >
            5 * 1024 * 1024
        ) {

            alert(
                "File size should be less than 5 MB."
            );

            return;

        }


        const reader =
            new FileReader();


        reader.onload = function () {

            const newNote = {

                id:
                    Date.now(),

                title:
                    title,

                subject:
                    subject,

                description:
                    description,

                icon:
                    getSubjectIcon(subject),

                fileName:
                    file.name,

                fileData:
                    reader.result

            };


            notes.push(newNote);


            saveUploadedNotes();


            displayNotes();


            uploadForm.reset();


            uploadMessage.textContent =
                "✅ Notes uploaded successfully!";


            uploadMessage.style.color =
                "#16a34a";


            setTimeout(
                function () {

                    uploadMessage.textContent =
                        "";

                },
                3000
            );

        };


        reader.readAsDataURL(file);

    }
);


// ==================================================
// GET SUBJECT ICON
// ==================================================

function getSubjectIcon(subject) {

    const icons = {

        "Computer Science": "💻",

        "Cloud Computing": "☁️",

        "Data Science": "📊",

        "DBMS": "🗄️",

        "Operating Systems": "⚙️",

        "Java": "☕",

        "Python": "🐍"

    };


    return icons[subject] || "📄";

}


// ==================================================
// SAVE NOTES
// ==================================================

function saveUploadedNotes() {

    const uploadedNotes =
        notes.filter(
            note => note.fileData
        );


    localStorage.setItem(
        "uploadedNotes",
        JSON.stringify(uploadedNotes)
    );

}


// ==================================================
// DOWNLOAD NOTES
// ==================================================

function downloadNote(id) {

    const note =
        notes.find(
            item => item.id === id
        );


    if (!note || !note.fileData) {

        alert(
            "This is a demo note. Upload a file to enable downloading."
        );

        return;

    }


    const link =
        document.createElement("a");


    link.href =
        note.fileData;


    link.download =
        note.fileName;


    document.body.appendChild(link);


    link.click();


    document.body.removeChild(link);

}


// ==================================================
// DELETE NOTES
// ==================================================

function deleteNote(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this note?"
        );


    if (!confirmDelete) {

        return;

    }


    notes =
        notes.filter(
            note => note.id !== id
        );


    saveUploadedNotes();


    displayNotes();

}


// ==================================================
// DEMO MESSAGE
// ==================================================

function showDemoMessage() {

    alert(
        "📚 This is a sample note. You can upload your own PDF/DOC file using the Upload Notes section."
    );

}


// ==================================================
// INITIAL DISPLAY
// ==================================================

displayNotes();