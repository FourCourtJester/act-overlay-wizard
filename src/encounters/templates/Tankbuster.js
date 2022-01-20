// Import core components
// ...

// Import our components
// ...

// Import style
// ...

function WizardEncounterTankBuster(props) {
    return (
        <div className="d-flex flex-column h-100 w-100">
            <p className="d-flex flex-shrink-1 fw-bold mb-1 w-100">
                {props.message.attributes.description}
                <button className="btn-close btn-close-white ms-auto" type="button" onClick={() => props.message.setVisible(false)} />
            </p>
            <div className="d-flex flex-column flex-grow-1 justify-content-center align-items-start w-100">
                <div className="d-flex justify-content-start align-items-center w-100 mb-1">
                    <img className="float-start me-2" src={process.env.PUBLIC_URL + `/images/tank.png`} alt="Tank action required" />
                    <div className="h4">
                        <span className="d-block">{props.message.action}</span>
                        <span className="d-block">{props.message.target}</span>
                    </div>
                </div>
                <div className="progress rounded-0 w-100 m-0">
                    <div className="progress-bar bg-warning" style={{'animationDuration': `${props.message.timeout}s`}}></div>
                </div>
            </div>
        </div>
    )
}

export default WizardEncounterTankBuster
