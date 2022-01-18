// Import core components
import { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Draggable from 'react-draggable'
import { ResizableBox } from 'react-resizable'
import { CSSTransition } from 'react-transition-group'
import slugify from 'slugify'

// Import our components
import { WebSocketContext } from 'contexts/WebSocket'
import { selectZone, updateZone } from 'db/slices/bestiary'
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
            zone: useSelector(selectZone),
        },
        // States
        [visible, setVisible] = useState(false),
        [locked, setLocked] = useState(false),
        [Encounter, setEncounter] = useState(undefined),
        [zone, setZone] = useState(null),
        // Refs
        $drag = useRef(null),
        $bestiary = useRef(null)

    function saveDrag(e, data) {
        dispatch(updateDraggable({ component: 'bestiary', x: data.x, y: data.y }))
    }

    function saveResize(e, data) {
        dispatch(updateResizable({ component: 'bestiary', width: data.size.width, height: data.size.height }))
    }

    useEffect(() => {
        // Subscribe to ChangeZone
        ws.on('ChangeZone', 'WizardBestiary', ({ zoneID, zoneName }) => {
            setZone({ id: zoneID, display_name: zoneName })
        })
    }, [ws])

    // Zone change, reset timers
    useEffect(() => {
        if (zone === null) return false

        // Remove all resting actions
        dispatch(updateZone(zone))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [zone])

    useEffect(() => {
        if (!cache.zone?.id) return false

        // console.log('Change Zone:', cache.zone)

        const slug = slugify(cache.zone.display_name, { strict: true })

        import(`encounters/${slug}`)
            .then((script) => {
                setEncounter(() => script.default)
            })
            .catch((err) => {
                setVisible(false)
                setEncounter(undefined)
            })
    }, [cache.zone])

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
                                {
                                    Encounter
                                    ? <Encounter setVisible={setVisible} />
                                    : <></>
                                }
                            </div>
                        </div>
                    </CSSTransition>
                </ResizableBox>
            </div>
        </Draggable>
    )
}

export default WizardBestiary
