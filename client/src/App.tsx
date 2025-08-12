// // What do I need?:
// // bg-image from taks doc: 'https://picsum.photos/1920/1080'
// // comps.: canvas, List, List item, loader/spinner, main
// // hooks?: maybe some usePolygons or useAPI for centralizing my API calls
// //

// //issues:
// // I need to create a flow that updates the data on each CRUD operation.

import classes from "./App.module.scss";
import MenuIcon from "./assets/menu-icon_50.svg?react";
import CloseMenuIcon from "./assets/close-icon_30.svg?react";

import { ToastContainer } from "react-toastify";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { usePolygons } from "./hooks/usePolygons";
import PolygonCanvas from "./components/canvas/PolygonCanvas";
import PolygonList from "./components/polygonList/PolygonList";
import { AppLoader } from "./components/appLoader/AppLoader";
import useServerReady from "./hooks/useServerReady";

const App: React.FC = () => {
  const { isServerReady } = useServerReady();
  const [isOpen, setIsOpen] = useState(false);
  const { fetchPolygons, polygons, loading, addPolygon, removePolygon, imageUrl } =
    usePolygons();
  const [selectedPolygonId, setSelectedPolygonId] = useState<string | null>(
    null
  );
  const [drawingPoints, setDrawingPoints] = useState<[number, number][]>([]);

  const toggleSidebar = useCallback(() => {
    if (Object.keys(polygons).length <= 0) return;
    handleSelectPolygon();
    setIsOpen((prev) => !prev);
  }, []);

  const handleAddPoint = useCallback((point: [number, number]) => {
    setDrawingPoints((prevPoints) => [...prevPoints, point]);
  }, []);

  const handleUndoPoint = useCallback(() => {
    setDrawingPoints([]);
  }, []);

  const handleSavePolygon = useCallback(async () => {
    if (drawingPoints.length > 2) {
      const name = prompt(
        "Enter new polygon name",
        `Shape-${polygons.length + 1}`
      );
      if (name !== null) {
        await addPolygon(name, drawingPoints);
        setDrawingPoints([]);
      }
    } else {
      console.log("Polygons must have at least three points to be saved.");
    }
  }, [addPolygon, drawingPoints, polygons.length]);

  const handleSelectPolygon = useCallback((id: string | null = null) => {
    setSelectedPolygonId(id);
  }, []);

  const handleDeletePolygon = useCallback(
    async (id: string) => {
      if (
        confirm("Are you sure you want to delete this shape from the database?")
      ) {
        await removePolygon(id);
        if (selectedPolygonId === id) {
          setSelectedPolygonId(null);
        }
      }
    },
    [removePolygon, selectedPolygonId]
  );

  const memoizedCanvas = useMemo(() => {
    if (imageUrl && imageUrl !== "") {
      return (
        <PolygonCanvas
          polygons={polygons}
          drawingPoints={drawingPoints}
          onAddPoint={handleAddPoint}
          onUndoPoint={handleUndoPoint}
          selectedPolygonId={selectedPolygonId}
          imageUrl={imageUrl}
        />
      );
    }
  }, [
    polygons,
    drawingPoints,
    handleAddPoint,
    handleUndoPoint,
    selectedPolygonId,
    imageUrl,
  ]);

  useEffect(() => {
    if (isServerReady) {
      fetchPolygons();
    }
  }, [isServerReady, fetchPolygons]);

  return (
    <div className={classes.appWrapper}>
      {/* FOR TOASTER MESSAGES */}
      <ToastContainer position="top-center" closeOnClick theme="dark" />

      {isServerReady ? (
        <div className={classes.appContainer}>
          {/* APP HEADER */}
          <div className={classes.appHeaderWrapper}>
            <div className={classes.appHeader}>
              <h1>Polygon App</h1>
              {drawingPoints.length > 2 && !loading && (
                <button
                  className={classes.saveButton}
                  onClick={handleSavePolygon}
                >
                  Save Polygon
                </button>
              )}
            </div>

            {/* SIDEBAR */}
            <div
              className={`${classes.sidebar} ${
                isOpen ? classes.isOpen : classes.isClosed
              }`}
            >
              {!isOpen ? (
                <>
                  <MenuIcon
                    className={classes.sidebarHamburgerButton}
                    onClick={toggleSidebar}
                    width={25}
                    height={25}
                  />
                </>
              ) : (
                <div className={classes.sidebarContent}>
                  <div className={classes.sidebarHeader}>
                    <span className={classes.sidebarHeaderSpan}>
                      <CloseMenuIcon
                        className={classes.sidebarCloseButton}
                        onClick={toggleSidebar}
                      ></CloseMenuIcon>
                      <h1>Polygons List</h1>
                    </span>
                  </div>
                  <hr></hr>

                  <PolygonList
                    polygons={polygons}
                    onDelete={handleDeletePolygon}
                    onSelect={handleSelectPolygon}
                    selectedPolygonId={selectedPolygonId}
                  />
                </div>
              )}
            </div>
          </div>

          {/* CANVAS */}
          <div className={classes.mainContent}>
            <p></p>
            {!loading && memoizedCanvas ? (
              <div className={classes.canvasContainer}>{memoizedCanvas}</div>
            ) : (
              <AppLoader />
            )}
          </div>
        </div>
      ) : (
        <p style={{ textAlign: "center" }}>Waiting for Server...</p>
      )}
    </div>
  );
};

export default App;
