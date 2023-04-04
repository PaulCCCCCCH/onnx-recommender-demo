import React, { useState, useCallback } from "react";
import { Tensor } from "onnxruntime-web"
import Login from "../Login";

type UserFeature = {
    age: number,
    gender: Array<number>,
    occupation: Array<number>
}

type MovieFeature = {
    genre: Array<number>,
    actors: Array<number>,
}


const localUserFeatureStore: { [key: string]: UserFeature } = {
    "guest": {
        age: 35,
        gender: [0.3333333, 0.3333333, 0.3333333],
        occupation: [0.25, 0.25, 0.25, 0.25],
    },
    "paulcccccch": {
        age: 24,
        gender: [0.9, 0.05, 0.05],
        occupation: [0.2, 0.5, 0.3, 0.4],
    },
    "nobita": {
        age: 10,
        gender: [0.5, 0.25, 0.25],
        occupation: [0.1, 0.2, 0.7, 0.3],
    }
}

const remoteMovieFeatureStore: { [key: string]: MovieFeature } = {
    "Movie X": {
        genre: [0.12, 0.23, 0.34, 0.45],
        actors: [0.45, 0.34, 0.23, 0.12]
    }
}

function predictRating(userFeature: UserFeature, movieFeature: MovieFeature): number {

    return 10
}

export default function Recommender() {

    const [currUser, setCurrUser] = useState<string>("guest")
    const [currMovie, setCurrMovie] = useState<string>("Movie X")

    const onLogin = useCallback((newUsername: string) => {
        setCurrUser(newUsername)
    }, [])

    const userFeature = localUserFeatureStore[currUser]
    const movieFeature = remoteMovieFeatureStore[currMovie]
    var ratingDOM;
    if (!userFeature || !movieFeature) {
        ratingDOM = <h1>User "{currUser}" not exist</h1>
    } else {
        const rating = predictRating(userFeature, movieFeature)
        ratingDOM = <>         
                <h2> User "{currUser}" might give "{currMovie}" a rate of {rating} </h2>
            </>

    }

    return (
        <>
            <Login onLogin={onLogin} />
            {ratingDOM}
        </>
    )
}