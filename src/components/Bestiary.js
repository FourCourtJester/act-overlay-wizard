// Import core components
import { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Draggable from 'react-draggable'
import { ResizableBox } from 'react-resizable';
import { CSSTransition } from 'react-transition-group'

// Import our components
import { WebSocketContext } from 'contexts/WebSocket'
import { selectComponent, updateDraggable, updateResizable } from 'db/slices/version'

// Import style
// ...

function WizardBestiary() {
    const
        // Redux
        dispatch = useDispatch(),
        // Context
        ws = useContext(WebSocketContext),
        // Variables
        cache = {
            component: useSelector((state) => selectComponent(state, 'bestiary')),
        },
        // States
        [visible, setVisible] = useState(true),
        [locked, setLocked] = useState(false),
        // Refs
        $drag = useRef(null),
        $bestiary = useRef(null)

    function saveDrag(e, data) {
        dispatch(updateDraggable({ component: 'bestiary', x: data.x, y: data.y }))
    }

    function saveResize(e, data) {
        dispatch(updateResizable({ component: 'bestiary', width: data.size.width, height: data.size.height }))
    }

    // Check for Lock status from OverlayPlugin.dll
    useEffect(() => {
        document.addEventListener('onOverlayStateUpdate', (e) => {
            setLocked(e.detail.isLocked)
        })
    }, [])

    return (
        <Draggable nodeRef={$drag} cancel=".react-resizable-handle" disabled={locked} defaultPosition={{ x: cache.component.x, y: cache.component.y }} onStop={saveDrag}>
            <div ref={$drag} className="bestiary-wrap position-absolute p-1">
                <ResizableBox className="bestiary-resize-wrap" width={cache.component.width} height={cache.component.height} onResizeStop={saveResize}>
                    <CSSTransition nodeRef={$bestiary} in={visible} timeout={375}>
                        <div ref={$bestiary} className="bestiary ffxiv-dialog h-100 w-100 p-1">
                            <div className="inner-dialog d-flex justify-content-center align-items-center h-100 w-100 p-2">
                                Box
                            </div>
                        </div>
                    </CSSTransition>
                </ResizableBox>
            </div>
        </Draggable>
    )
}

export default WizardBestiary
