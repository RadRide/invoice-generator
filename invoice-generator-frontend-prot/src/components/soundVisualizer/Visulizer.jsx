import React, {useContext, useEffect, useRef, useState} from 'react';



function Visualizer({ startListening, stopListening }) {

    const ref = useRef();

    const [counter, setCounter] = useState(0);

    function handleCounter(){
        if(counter === 0){
            startListening();
        }
        else if(counter === 1){
            stopListening();
        }
        setCounter(c => (c + 1) % 2);
    }

    const setCanvasSize = (canvas) => {
        const parent = canvas.parentElement;
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
    };

    const draw = (context, analyzer, dataArray, bars) => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        // contexts.fillStyle = "#fefefe";

        const samples = getSamples(analyzer, dataArray);

        bars.forEach((bar, i) => {
            updateBar(bar, samples[i]);
            drawBar(context, bar);
        })
        // console.log(getSamples(analyzer, dataArray));

        // contexts.fillRect(10, 10, 100, 100);
    }

    const updateBar = (bar, micInput) => {
        const sound = micInput * 256;
        if(sound > bar.height){
            if(counter !== 0){
                bar.height = sound;
            }
        }else{
            bar.height -= bar.height * 0.03;
        }
    }

    const drawBar = (context, bar) => {
        context.fillStyle = bar.color;

        context.strokeStyle = bar.color;
        context.save();

        context.translate(context.canvas.width / 2, context.canvas.height / 2);
        context.rotate(bar.index * 0.04)
        context.beginPath();
        context.moveTo(0, 0);
        context.stroke();
        context.fillRect(0, 100, 2, bar.height < 5 ? 5 : bar.height)

        context.restore();
    }

    const getSamples = (analyzer, dataArray) => {
        analyzer.getByteTimeDomainData(dataArray);

        let normalSamples = [...dataArray].map(e => e/128 - 1);
        return normalSamples;
    }

    useEffect( () => {

        async function getMic() {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});
            const audioContext = new AudioContext();
            const microphone = audioContext.createMediaStreamSource(stream);
            const analyzer = audioContext.createAnalyser();
            analyzer.fftSize = 4096;
            microphone.connect(analyzer);

            return analyzer;
        }

        function getDataArray(analyzer) {
            return new Uint8Array(analyzer.frequencyBinCount);
        }

        let animationId;

        const run = async () => {
            const analyzer = await getMic();
            let dataArray = getDataArray(analyzer);

            const canvas = ref.current;
            const context = canvas.getContext("2d");

            const barCount = 1024;
            let bars = [];
            let barWidth = canvas.width/barCount;

            for(let i = 0; i < barCount; i++) {
                bars.push({
                    x: i * barWidth,
                    y: canvas.height / 2,
                    width: 10,
                    height: 10,
                    color: "#FEFEFE",
                    index: i
                });
            }


            const render = () => {
                setCanvasSize(canvas);
                draw(context, analyzer, dataArray, bars);
                animationId = window.requestAnimationFrame(render);
            }

            render();
        }

        run().then();

        const handleResize = () => {
            const canvas = ref.current;
            setCanvasSize(canvas);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
        };
    }, [counter]);

    return (
        <div className="flex-1 relative w-full h-[400px] lg:h-[600px]">
            <canvas ref={ref} className=""/>
            <label
                className={`swap absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl border border-white rounded-full p-10 transition-all ${counter === 1 ? "bg-red-500" : ""}`}>
                {/* this hidden checkbox controls the state */}
                <input type="checkbox" onClick={handleCounter}/>

                {/* sun icon */}
                <svg className="swap-off h-10 w-10 fill-current"
                     xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 64 64">
                    <g>
                        <path fill="#fefefe" d="M32,48c7.732,0,14-6.268,14-14V14c0-7.732-6.268-14-14-14S18,6.268,18,14v20C18,41.732,24.268,48,32,48z
                                 M20,31h5c0.553,0,1-0.447,1-1s-0.447-1-1-1h-5v-4h5c0.553,0,1-0.447,1-1s-0.447-1-1-1h-5v-4h5c0.553,0,1-0.447,1-1s-0.447-1-1-1
                                h-5v-3c0-6.627,5.373-12,12-12s12,5.373,12,12v3h-5c-0.553,0-1,0.447-1,1s0.447,1,1,1h5v4h-5c-0.553,0-1,0.447-1,1s0.447,1,1,1h5v4
                                h-5c-0.553,0-1,0.447-1,1s0.447,1,1,1h5v3c0,6.627-5.373,12-12,12s-12-5.373-12-12V31z"/>
                        <path fill="#fefefe" d="M51,31.002c-1.657,0-2.999,1.342-3,2.998c-0.001,8.838-7.163,15.999-16,15.999S16.001,42.838,16,34
                                c0-1.656-1.343-3-3-3s-3,1.344-3,3c0,10.43,7.26,19.157,17,21.423v4.576c0,2.209,1.791,4,4,4h2c2.209,0,4-1.791,4-4v-4.576
                                C46.74,53.157,54,44.43,54,34C53.999,32.344,52.657,31.002,51,31.002z M37,53.345c-0.654,0.168-1.321,0.304-2,0.407v6.247
                                c0,1.104-0.896,2-2,2h-2c-1.104,0-2-0.896-2-2v-6.247c-0.679-0.104-1.346-0.239-2-0.407C18.379,51.121,12,43.315,12,34
                                c0-0.553,0.447-1,1-1s1,0.447,1,1c0.001,9.94,8.059,17.999,18,17.999S49.999,43.94,50,34c0.001-0.551,0.447-0.998,1-0.998
                                s0.999,0.447,1,0.998C52,43.315,45.621,51.121,37,53.345z"/>
                    </g>
                </svg>

                {/* moon icon */}
                <svg
                    className="swap-on h-10 w-10 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 64 64">
                    <g>
                        <path fill="#fefefe" d="M32,48c7.732,0,14-6.268,14-14v-3h-7c-0.553,0-1-0.447-1-1s0.447-1,1-1h7v-4h-7c-0.553,0-1-0.447-1-1
                                s0.447-1,1-1h7v-4h-7c-0.553,0-1-0.447-1-1s0.447-1,1-1h7v-3c0-7.732-6.268-14-14-14S18,6.268,18,14v3h7c0.553,0,1,0.447,1,1
                                s-0.447,1-1,1h-7v4h7c0.553,0,1,0.447,1,1s-0.447,1-1,1h-7v4h7c0.553,0,1,0.447,1,1s-0.447,1-1,1h-7v3C18,41.732,24.268,48,32,48z"
                        />
                        <path fill="#fefefe" d="M51,31.002c-1.657,0-2.999,1.343-3,3C47.999,42.838,40.837,50,32,50s-15.999-7.162-16-15.998
                                c0-1.657-1.343-3-3-3s-3,1.343-3,3c0,10.429,7.26,19.156,17,21.422V60c0,2.209,1.791,4,4,4h2c2.209,0,4-1.791,4-4v-4.576
                                c9.74-2.266,17-10.993,17-21.422C53.999,32.345,52.657,31.002,51,31.002z M37,53.346c-0.654,0.168-1.321,0.304-2,0.406v1.247v0.794
                                V60c0,1.104-0.896,2-2,2h-2c-1.104,0-2-0.896-2-2v-4.207v-0.794v-1.247c-0.679-0.103-1.346-0.238-2-0.406
                                c-8.621-2.224-15-10.029-15-19.344c0-0.554,0.447-1,1-1s1,0.446,1,1C14.001,43.941,22.059,52,32,52s17.999-8.059,18-17.998
                                c0.001-0.552,0.447-1,1-1s0.999,0.448,1,1C52,43.316,45.621,51.122,37,53.346z"/>
                    </g>
                </svg>
            </label>
        </div>
    );
}


export default Visualizer;