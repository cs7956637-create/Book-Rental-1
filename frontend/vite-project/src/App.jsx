import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Navbar from "./componets/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import BookDetails from "./pages/BookDetails";
import Reader from "./pages/Reader";
import MyBooks from "./pages/MyBooks";
import EditBook from "./pages/EditBook";
import AdminAddBook from "./pages/AdminAddBook";


function App() {

    return (

        <BrowserRouter>

            <Navbar />

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/books/:id"
                    element={<BookDetails />}
                />

              <Route
    path="/reader/:bookId"
    element={<Reader />}
/>
                <Route
                    path="/my-books"
                    element={<MyBooks />}
                />
                  <Route
    path="/admin"
    element={<AdminDashboard />}
/>

<Route
    path="/admin/edit-book/:id"
    element={<EditBook />}
/>

<Route
    path="/admin/add-book"
    element={<AdminAddBook />}
/>
            </Routes>

        </BrowserRouter>

    );

}

export default App;