import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter,Link,Route } from 'react-router-dom'

const Carnitas =({ match })=>(
  <div>
  <h1>Hello {match.url}</h1>
  <h1>Hello {match.params.username}</h1>
  </div>
)

const Tacos  = ({ match }) => (
  // here's a nested div
  <div>
    {/* here's a nested Route,
        match.url helps us make a relative path */}
    <Route
      path={match.url + '/carnitas'}
      component={Carnitas}
    />
  </div>
)

const App = () => (
  <div>
    <div>
    <Link to="/tacos">tacos</Link>
    </div>
    <div>
    <Link to="/tacos/carnitas">tacos</Link>
    </div>
    <div>
      <Route path="/tacos" component={Tacos}/>
    </div>
    </div>
  )
  const supportsHistory = 'pushState' in window.history
ReactDOM.render((
  <BrowserRouter forceRefresh={!supportsHistory} >
    <App/>
  </BrowserRouter>
), document.getElementById('root'))


