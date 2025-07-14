import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UserComponent from './components/User';
import Login from './components/Login';
import ProtectedRoute from './routes/ProtectedRoute';
import Register from './components/Register';
import HistoryComponent from './components/History';
import { ToastContainer, Zoom } from 'react-toastify';

const App: React.FC = () => {
  return (
    <div className=''>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Zoom} />

      <Routes>
        <Route path="/">
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<UserComponent />} />
            <Route path="/user" element={<UserComponent />} />
            <Route path="/history" element={<HistoryComponent />} />
          </Route>
        </Route>
      </Routes >
    </div>
  );
}

export default App;
