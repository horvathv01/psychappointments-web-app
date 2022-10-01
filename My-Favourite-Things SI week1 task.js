const myFavBook = {
title: "Lord of the Rings",
author: "J. R. R. Tolkien",
year: 1954,
description: "Fantasy-novel series by English author and scholar J. R. R. Tolkien."
};

const myFavMovie = {
title: "Star Wars",
director: "George Lucas",
year: 1977,
description: "Sci-fi movie series starting with A New Hope, followed by 5 sequels, 3 prequels, a few additional stories and many TV series.",
actors: {
    actor1 : {
        actorName: "Mark Hamill",
        roleName: "Luke Skywalker",
    },
    actor2 : {
        actorName: "Alec Guinness",
        roleName: "Obi Wan Kenobi",
    },
    actor3 : {
        actorName: "Harrison Ford",
        roleName: "Han Solo",
    },
    actor4 : {
        actorName: "Carrie Fisher",
        roleName: "Leia Organa",
    },
    actor5 : {
        actorName: "David Prowse",
        roleName: "Darth Vader",
    }  
    }
};

let myFavSeries = {
    title: 'Black Mirror',
    directors: ['Owen Harris', 'Carl Tibbetts', 'James Hawes'],
    seasons: {
        season1: {
            episodes: 3,
            startYear: 2011,
            endYear: 2011,
        },
        season2: {
            episodes: 3,
            startYear: 2013,
            endYear: 2013,
        },
        season3: {
            episodes: 6,
            startYear: 2016,
            endYear: 2016,
        },
        season4: {
            episodes: 6,
            startYear: 2017,
            endYear: 2017,
        },
        season5: {
            episodes: 8,
            startYear: 2019,
            endYear: 2019,
        },
    },
    description: '',
    actors: {
        actor1: {
            actorName: 'Daniel Lapaine',
            roleName: 'Dawson',
        },
        actor2: {
            actorName: 'Hannah John-Kamen',
            roleName: 'Selma Telse',
        },   
        actor3: {
            actorName: 'Michaela Coel',
            roleName: 'Airport Stewardess',
        },
        actor4: {
            actorName: 'Charles Babalola',
            roleName: 'Tus',
        },
        actor5: {
            actorName: 'Aaron Paul',
            roleName: 'Gamer691',
        }, 
    }
}
const myFavs = {
    book: myFavBook,
    movie: myFavMovie,
    series: myFavSeries
}

function firstTask () { // "console log some details" task
console.log("first task: " + "favourite book's author: " + myFavBook.author);
console.log("first task: " + "favourite movie's first actor's role name: " + myFavMovie.actors.actor1.roleName);
console.log("first task: " + "favourite series' last season's end year: " + myFavSeries.seasons.season5.endYear);
}

function secondTask () {
for (let i = 1; i <= myFavs.series.seasons.season5.episodes; i++) {
    console.log("second task: " + myFavs.series.title + " episode " + i);
}
}

function thirdTask () {
    if (myFavs.series.directors.length > 1) {
        for (let k = 0; k <= (myFavs.series.directors.length - 1); k++) {
            console.log("third task: " + myFavs.series.directors[k]);
        }
    } else {
        let director = myFavs.series.directors[0];
        console.log("third task: " + director);
    }
}

firstTask();
secondTask();
thirdTask();