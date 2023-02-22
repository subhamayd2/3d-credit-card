import "./style.scss";

const card = document.querySelector(".card");
const cardWrapper = document.querySelector(".card_wrapper");
const cardGlare = card.querySelector(".card_glare");

const reqGyro = document.getElementById("req_gyro");
const stopGyro = document.getElementById("stop_gyro");
const output = document.getElementById("output");

const updateAngle = (mX, mY) => {
    const cardMidX = cardWrapper.offsetWidth / 2;
    const cardMidY = cardWrapper.offsetHeight / 2;

    const cardRect = cardWrapper.getBoundingClientRect();

    const cardX = cardRect.left;
    const cardY = cardRect.top;

    const multiplierX = clamp((mX - cardX - cardMidX) / cardMidX);
    const multiplierY = clamp((mY - cardY - cardMidY) / cardMidY);

    card.style.setProperty("--x", -1 * multiplierY * 25 + "deg");
    card.style.setProperty("--y", multiplierX * 25 + "deg");

    const moveX = clamp((mX - cardX - cardMidX) / cardMidX);

    cardGlare.style.transform =
        "translateZ(1px) translateX(" +
        -1 * cardWrapper.offsetWidth * moveX +
        "px)";

    // console.log({
    //   mX: mX -cardX,
    //   mY: mY - cardY,
    //   cardX,
    //   cardY,
    //   cardW:cardWrapper.offsetWidth,
    //   cardH:cardWrapper.offsetHeight,
    //   cardMidX,
    //   cardMidY,
    //   // multiplierX,
    //   // multiplierY
    // });
};

const clamp = (num, min = -1, max = 1) => {
    if (num < min) return min;
    if (num > max) return max;
    return num;
};

document.addEventListener("mousemove", (e) => {
    updateAngle(e.clientX, e.clientY);
});

const handleMotion = (event) => {
    console.log(event);
};

const handleOrientation = (event) => {
    output.innerHTML = JSON.stringify({
        x: clamp(event.gamma, -45, 45),
        y: clamp(event.beta, -45, 45)
    }, null, 2);
};

reqGyro.addEventListener("click", () => {
    if (DeviceMotionEvent.requestPermission) {
        DeviceMotionEvent.requestPermission().then((response) => {
            console.log({ response });
            if (response == "granted") {
                // Add a listener to get smartphone acceleration
                // in the XYZ axes (units in m/s^2)
                // window.addEventListener("devicemotion", handleMotion);
                // Add a listener to get smartphone orientation
                // in the alpha-beta-gamma axes (units in degrees)
                window.addEventListener("deviceorientation", handleOrientation);
            }
        });
    } else {
        console.log("No Gyro!");
    }
});

stopGyro.addEventListener("click", () => {
    // window.removeEventListener("devicemotion", handleMotion);
    window.removeEventListener("deviceorientation", handleOrientation);
});
