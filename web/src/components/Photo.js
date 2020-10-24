import React, { useState, useEffect, useCallback } from 'react';
import Magnifier from 'react-magnifier';
import { useHotkeys } from 'react-hotkeys-hook';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import cx from 'classnames';

import useWindowSize from '../hooks/use-window-size';
import { magActiveState, rightModeState, zoomFactorState } from '../state';

export default ({ photo: { name } }) => {
  const url = `/photos/${name}`;
  const history = useHistory();

  const [winW, winH] = useWindowSize();
  const [[imgW, imgH], setImgAttrs] = useState([0, 0]);
  useEffect(() => {
    let img = new Image();
    img.onload = () => {
      setImgAttrs([img.width, img.height]);
    };
    img.src = url;
  }, [url]);

  const scale = imgW ? 1 / Math.max(imgW / winW, imgH / winH) : 1;
  const w = imgW * scale;
  const h = imgH * scale;

  const [magActive, setMagActive] = useRecoilState(magActiveState);
  const [hidden, setHidden] = useState(false);
  const [rightMode, setRightMode] = useRecoilState(rightModeState);

  useHotkeys('g', () => history.push('/'), {}, [history]);
  useHotkeys('m', () => setMagActive(!magActive), {}, [magActive]);
  useHotkeys('h', () => setHidden(!hidden), {}, [hidden]);
  useHotkeys('r', () => setRightMode(!rightMode), {}, [rightMode]);

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
    >
      <div
        className={cx('flex', {
          'opacity-0': hidden,
          'justify-center': !rightMode,
          'justify-end': rightMode,
        })}
      >
        {magActive && w * 2 < winW ? <img {...imgAttrs} /> : false}
        {magActive ? <Magnifier {...magnifierAttrs} /> : <img {...imgAttrs} />}
      </div>
    </div>
  );
};
