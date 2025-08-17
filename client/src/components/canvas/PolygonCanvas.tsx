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
  const originalCanvasSize = { width: 1920, height: 1080 }; // Set to your original canvas size
  const image = new Image();

  const drawPolygons = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, size.width, size.height); // Clear the canvas

      ctx.drawImage(image, 0, 0, size.width, size.height);

      drawExistingPolygons(ctx);
      drawNewPolygon(ctx);
    },
    [size, image, polygons, drawingPoints, mousePosition, isDrawing]
  );

  const drawNewPolygon = (ctx: CanvasRenderingContext2D) => {
    if (drawingPoints.length > 0 && isDrawing) {
      ctx.beginPath();
      drawingPoints.forEach(([x, y], index) => {
        const scaledX = (x / originalCanvasSize.width) * size.width;
        const scaledY = (y / originalCanvasSize.height) * size.height;
        if (index === 0) {
          ctx.moveTo(scaledX, scaledY);
        } else {
          ctx.lineTo(scaledX, scaledY);
        }
      });
      ctx.strokeStyle = "lime";
      ctx.lineWidth = 2;
      ctx.stroke();

      if (mousePosition) {
        ctx.beginPath();
        const lastPoint = drawingPoints[drawingPoints.length - 1];
        ctx.moveTo(
          (lastPoint[0] / originalCanvasSize.width) * size.width,
          (lastPoint[1] / originalCanvasSize.height) * size.height
        );
        ctx.lineTo(
          (mousePosition[0] / originalCanvasSize.width) * size.width,
          (mousePosition[1] / originalCanvasSize.height) * size.height
        );
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
        const scaledX = (x / originalCanvasSize.width) * size.width;
        const scaledY = (y / originalCanvasSize.height) * size.height;
        if (index === 0) {
          ctx.moveTo(scaledX, scaledY);
        } else {
          ctx.lineTo(scaledX, scaledY);
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

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      setIsDrawing(true);
      const rect = canvas.getBoundingClientRect();
      const x =
        (event.clientX - rect.left) * (originalCanvasSize.width / size.width); // Adjust for scaling
      const y =
        (event.clientY - rect.top) * (originalCanvasSize.height / size.height); // Adjust for scaling

      onAddPoint([x, y]);
    },
    [onAddPoint, size]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas || drawingPoints.length === 0 || !isDrawing) return;

      const rect = canvas.getBoundingClientRect();
      const x =
        (event.clientX - rect.left) * (originalCanvasSize.width / size.width); // Adjust for scaling
      const y =
        (event.clientY - rect.top) * (originalCanvasSize.height / size.height); // Adjust for scaling

      setMousePosition([x, y]);
    },
    [drawingPoints.length, isDrawing, size]
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
    [onUndoPoint]
  );

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (imageUrl) {
      image.src = imageUrl;
      image.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = size.width;
          canvas.height = size.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            drawPolygons(ctx);
          }
        }
      };
    }
  }, [imageUrl, drawPolygons]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = size.width;
      canvas.height = size.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        drawPolygons(ctx);
      }
    }
  }, [size, drawPolygons]);

  return (
    <>
      <canvas
        width={size.width}
        height={size.height}
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
