import React, { useState, useEffect, useCallback } from 'react';
import Magnifier from 'react-magnifier';
import ColorThief from 'colorthief';
import { useHotkeys } from 'react-hotkeys-hook';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import useWindowSize from '../hooks/use-window-size';
import { magActiveState, zoomFactorState } from '../state';

const colorThief = new ColorThief();

export default ({ photo: { name } }) => {
  const url = `/photos/${name}`;
  const history = useHistory();

  const [winW, winH] = useWindowSize();
  const [[imgW, imgH, backgroundColor], setImgAttrs] = useState([
    0,
    0,
    '#f0f0f0',
  ]);
  useEffect(() => {
    let img = new Image();
    img.onload = () => {
      const [r, g, b] = colorThief.getColor(img, 50);
      setImgAttrs([img.width, img.height, `rgb(${r}, ${g}, ${b})`]);
    };
    img.src = url;
  }, [url]);

  const scale = imgW ? 1 / Math.max(imgW / winW, imgH / winH) : 1;
  const w = imgW * scale;
  const h = imgH * scale;

  useHotkeys(
    'g',
    () => {
      history.push('/');
    },
    {},
    [history]
  );
  const [magActive, setMagActive] = useRecoilState(magActiveState);
  useHotkeys(
    'm',
    () => {
      setMagActive(!magActive);
    },
    {},
    [magActive]
  );

  const imgAttrs = {
    alt: name,
    src: url,
    width: w.toFixed(),
    height: h.toFixed(),
  };

  const [zoomFactor, setZoomFactor] = useRecoilState(zoomFactorState);
  const onWheel = useCallback(
    ({ deltaY }) => {
      if (!magActive) {
        return;
      }
      if (deltaY < 0 && zoomFactor < 3) {
        setZoomFactor(zoomFactor + 0.25);
      }
      if (deltaY > 0 && zoomFactor > 0.25) {
        setZoomFactor(zoomFactor - 0.25);
      }
    },
    [magActive, zoomFactor]
  );

  const magSize = Math.ceil(Math.max(w, h) / 2);

  const magnifierAttrs = {
    src: url,
    width: `${w.toFixed()}px`,
    height: `${h.toFixed()}px`,
    mgWidth: magSize,
    mgHeight: magSize,
    mgShape: 'square',
    zoomFactor,
  };

  return (
    <div
      {...{ onWheel }}
      className="fixed w-full h-full top-0 left-0 bg-no-repeat"
      style={{
        backgroundColor,
      }}
    >
      <div className="flex justify-center">
        {magActive && w * 2 < winW ? <img {...imgAttrs} /> : false}
        {magActive ? <Magnifier {...magnifierAttrs} /> : <img {...imgAttrs} />}
      </div>
    </div>
  );
};
