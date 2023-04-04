import React, { useEffect, useState, useCallback } from "react";
import { Tensor, InferenceSession } from "onnxruntime-web"
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

async function getOnnxModel(modelPath: string) {
    const fetchResult = await fetch(modelPath)
    const model = await fetchResult.arrayBuffer()
    return await InferenceSession.create(model, {executionProviders: ['wasm']});
}


async function predictRating(userFeature: UserFeature, movieFeature: MovieFeature, model: InferenceSession) {
    const {age, gender, occupation} = userFeature
    const {genre, actors} = movieFeature
    const inputTensor = new Tensor('float32', [age].concat(gender, occupation, genre, actors))

    const feeds: Record<string, Tensor> = {};
    feeds[model.inputNames[0]] = inputTensor;
    const output = await model.run(feeds);
    return output[model.outputNames[0]]
}

export default function Recommender() {

    const [currUser, setCurrUser] = useState<string>("guest")
    const [currMovie, ] = useState<string>("Movie X")
    const [currRating, setCurrRating] = useState<number>()

    const [model, setModel] = useState<InferenceSession>()
    const modelPath = "/linear_reg_recommender.onnx"

    useEffect(() => {
        const getModel = async () => {
            const model = await getOnnxModel(modelPath)
            setModel(model) 
        }
        getModel().catch(console.error)
    }, [])

    useEffect(() => {
        const userFeature = localUserFeatureStore[currUser]
        
        const movieFeature = remoteMovieFeatureStore[currMovie]

        if (!userFeature || !movieFeature) {
            return
        } else if (!model) {
            return
        } else {
            predictRating(userFeature, movieFeature, model).then(tensor => {
                const outputNum = tensor.data as Float32Array
                if (outputNum) setCurrRating(outputNum[0])
            })
        }
    }, [currUser, currMovie, model])


    const onLogin = useCallback((newUsername: string) => {
        setCurrUser(newUsername)
    }, [])

    return (
        <>
            <Login onLogin={onLogin} />
            {currRating ? <h2>User "{currUser}"'s rating on movie "{currMovie}" is {currRating}</h2> : 
            <h2> User not found </h2>}
        </>
    )
}