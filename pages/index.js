import { useGesture } from "react-use-gesture";
import { useRef, useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clamp from "lodash/clamp";
import throttle from "lodash/throttle";
import ReactDom from "react-dom";
import Header from "../components/Header";
import WonderShake from "../components/WonderShake";
import Intro from "../components/Intro";
import FruitFizz from "../components/FruitFizz";
import Waffles from "../components/Waffles";
import Shawarma from "../components/Shawarma";
import Footer from "../components/Footer";
import { fastBubs, pushBubble } from "../components/Bub";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Home({ dimensions }) {
  const _window = useRef(null);
  const router = useRouter();

  const div = useRef(null);
  const [transitions, setTransation] = useState({
    nextStep: 0,
    previousStep: 0,
  });
  const [introExited, setintroExited] = useState(false);
  const [step, setStep] = useState(0);
  // const [showHeader, setShowHeader] = useState(true);
  const [loaded, setIsLoaded] = useState(false);

  useEffect(() => {
    _window.current = window;
    fastBubs();

    setTimeout(() => {
      pushBubble({
        quantity: 10,
        duration: 6,
        repeat: true,
      });
    }, 1000);
  }, []);
  function handleEvent(e) {
    if (["ArrowDown", "ArrowRight"].includes(e.code) && step < 7) {
      nextStep.current(1);
    }
    if (["ArrowUp", "ArrowLeft"].includes(e.code) && step > 0) {
      nextStep.current(-1);
    }
  }
  useEffect(() => {
    document.addEventListener("keydown", handleEvent);
    return () => document.removeEventListener("keydown", handleEvent);
  }, [step]);

  useEffect(() => {
    if (dimensions.width > 1 && dimensions.width <= 768) router.push("/mobile");
    else if (dimensions.width > 1) setIsLoaded(true);
  }, [dimensions.width]);

  useGesture(
    {
      onWheel: ({ vxvy: [, vy], movement: [x, y] }) => {
        if (y > 125 && vy > 0 && step < 7) nextStep.current(1);
        else if (y < -125 && vy < 0 && step > 0) nextStep.current(-1);
      },
    },
    {
      domTarget: _window,
    }
  );

  const nextStep = useRef(
    throttle(
      (a) => {
        if (a == 1) {
          setStep((v) => {
            setTransation({ ...transitions, previousStep: v, nextStep: v + 1 });
            // setShowHeader(false);

            return v;
          });
          setTimeout(() => {
            setStep((v) => {
              if ([0, 6].includes(v)) fastBubs();
              return v + 1;
            });
          }, 10);
        } else if (a == -1) {
          setStep((v) => {
            setTransation({ ...transitions, previousStep: v, nextStep: v - 1 });
            // setShowHeader(true);

            return v;
          });
          setTimeout(() => {
            setStep((v) => {
              if ([2, 7].includes(v)) fastBubs();
              return v - 1;
            });
          }, 10);
        }
      },
      1200,
      { leading: true, trailing: false }
    )
  );
  if (!loaded) return <p>loading</p>;

  return (
    <div
      className="overflow-hidden block relative m-0 p-0 z-0"
      ref={div}
      id="container"
      style={{
        background:
          "radial-gradient(circle, rgba(255,255,255,0.3337710084033614) 0%, rgba(89,199,115,0) 39%, rgba(0,0,0,0.3477766106442577) 100%)",
      }}
    >
      <Head>
        <title>BUB-T by ASHAAN FOODS</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header show={true} />
      <motion.div
        className="h-screen w-screen"
        animate={
          step == 0
            ? {
                backgroundColor: "rgb(0,255,235)",
              }
            : [1, 2].includes(step)
            ? {
                backgroundColor: "rgb(111,253,118)",
              }
            : step == 3
            ? {
                backgroundColor: "#f27d1d",
              }
            : step == 4
            ? {
                backgroundColor: "#ea1c39",
              }
            : step == 5
            ? {
                backgroundColor: "#f96400",
              }
            : step >= 6 && {
                backgroundColor: "#f5e0c3",
              }
        }
        transition={{ duration: 1 }}
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(89,199,115,0) 39%, rgba(0,0,0,0.15) 100%)",
        }}
      >
        <AnimatePresence exitBeforeEnter>
          {[0, 1, 2].includes(step) ? (
            <Intro
              step={step}
              key="012"
              transitions={transitions}
              setintroExited={setintroExited}
              introExited={introExited}
              dimensions={dimensions}
            />
          ) : step == 3 ? (
            <WonderShake step={step} key="3" transitions={transitions} />
          ) : step == 4 ? (
            <FruitFizz step={step} key="4" transitions={transitions} />
          ) : step == 5 ? (
            <Waffles step={step} key="5" transitions={transitions} />
          ) : step == 6 ? (
            <Shawarma step={step} key="6" transitions={transitions} />
          ) : (
            step == 7 && (
              <Footer step={step} key="7" transitions={transitions} />
            )
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export const durations = {
  cupDuration: 0.4,
  cupDelay: 0,
  titleDuration: 0.6,
  titleDelay: 0.2,
  exitDuration: 0.4,
};
