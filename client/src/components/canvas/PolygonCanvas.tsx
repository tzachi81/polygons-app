// //What do I need here?

// // draw function: init canvas, draw a shape from given points,
// // delete path/partial path,
// // get shape points/details on click
// //more?

//REFERENCES:
// //For review:
// Drawing shapes on canvas:
// // https://dev.to/get_pieces/drawing-interactive-shapes-with-canvas-elements-in-a-react-application-3d2n
// // https://medium.com/@na.mazaheri/dynamically-drawing-shapes-on-canvas-with-fabric-js-in-react-js-8b9c42791903
// Polygon loader animation:
// // https://ploygonsloader.blogspot.com/2025/08/colorful-polygon-gear-loader.html

import classes from "./polygonCanvas.module.scss";
import React, { useRef, useEffect, useCallback, memo, useState } from "react";
import type { FC } from "react";
import type { IPolygon } from "../../types/global.types";

interface PolygonCanvasProps {
  polygons: IPolygon[];
  drawingPoints: [number, number][];
  onAddPoint: (point: [number, number]) => void;
  onUndoPoint: () => void;
  selectedPolygonId: string | null;
  imageUrl: string;
}

const PolygonCanvas: FC<PolygonCanvasProps> = ({
  polygons,
  drawingPoints,
  onAddPoint,
  onUndoPoint,
  selectedPolygonId,
  imageUrl,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [mousePosition, setMousePosition] = useState<[number, number] | null>(
    null
  );
  const [isDrawing, setIsDrawing] = useState(false);

  const drawNewPolygon = (ctx: CanvasRenderingContext2D) => {
    if (drawingPoints.length > 0 && isDrawing) {
      ctx.beginPath();
      drawingPoints.forEach(([x, y], index) => {
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.strokeStyle = "lime";
      ctx.lineWidth = 2;
      ctx.stroke();

      if (mousePosition) {
        ctx.beginPath();
        const lastPoint = drawingPoints[drawingPoints.length - 1];
        ctx.moveTo(lastPoint[0], lastPoint[1]);
        ctx.lineTo(mousePosition[0], mousePosition[1]);
        ctx.strokeStyle = "lime";
        ctx.setLineDash([5, 7]);
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  };

  const drawExistingPolygons = (ctx: CanvasRenderingContext2D) => {
    polygons.forEach((polygon) => {
      ctx.beginPath();
      polygon.points.forEach(([x, y], index) => {
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.closePath();
      ctx.strokeStyle =
        String(polygon.id) === selectedPolygonId ? "red" : "yellow";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
      ctx.fill();
    });
  };

  const image = new Image();

  const drawPolygons = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageUrl) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get canvas context");
      return;
    }

    image.onload = () => {
      //I changed it from image.[width/height]
      //to window.inner[x] to make it responsive
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      drawExistingPolygons(ctx);
      drawNewPolygon(ctx);
    };
    image.src = imageUrl;
    image.width = window.innerWidth;
    image.height = window.innerHeight;
  }, [polygons, selectedPolygonId, drawingPoints, mousePosition]);

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      setIsDrawing(true);
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      onAddPoint([x, y]);
    },
    [onAddPoint]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas || drawingPoints.length === 0 || !isDrawing) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setMousePosition([x, y]);
    },
    [drawingPoints.length, isDrawing]
  );

  const handleMouseLeave = useCallback(() => {
    setMousePosition(null);
  }, []);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      event.preventDefault();
      setIsDrawing(false);
      setMousePosition(null);
      onUndoPoint();
    },
    [onUndoPoint, drawingPoints]
  );

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);

    drawPolygons();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [size.width, size.height]);

  useEffect(() => {
    if (polygons && imageUrl !== "") {
      drawPolygons();
    }
  }, [drawPolygons, imageUrl, size, polygons]);

  return (
    <>
      <canvas
        className={classes.polygonCanvas}
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onContextMenu={handleContextMenu}
      />
    </>
  );
};

export default memo(PolygonCanvas);
