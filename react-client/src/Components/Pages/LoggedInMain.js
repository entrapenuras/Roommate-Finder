import { Component, PropTypes } from "react";
import { CreateListingComponent } from "../Views/CreateListingComponent";
import { EditListingComponent } from "../Views/EditListingComponent";
import { CreateListingButton } from "../Buttons/CreateListingButton";
import { ListOfListings } from "../ListOfListings";
import { FilterComponent } from "../Views/FilterComponent";
import axios from "axios";
import Pusher from "pusher-js";
import "./EntryScreen.css";
import "./Filters.css";
import { DeleteListingComponent } from "../Views/DeleteListingComponent";
import img1 from "../Pages/Icons/UserIcon.png";
import LogOutButton from "../Views/LogOutButton";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { motion } from "framer-motion";

export class LoggedInMain extends Component {
    constructor(props) {
        super(props);

        this.state = {
            city: null,
            listings: undefined,
            createListingView: false,
            editListingView: false,
            editedListing: null,
            deletedListing: null,
            deleteListingView: false,
            currentUser: null,
            userFirstName: "",
            userLastName: "",
            userId: null,
        };

        this.toggleCreateListing = this.toggleCreateListing.bind(this);
    }

    updateListings = (listings) => {
        this.setState({ listings: listings });
    };

    toggleCreateListing = (toggleBool) => {
        this.setState({ createListingView: toggleBool });
        this.getListings();
    };

    toggleCreateListingWrapper = () => {
        this.toggleCreateListing(true);
    };

    toggleEditListingView = (listing, toggleBool) => {
        this.setState({
            editedListing: listing,
            editListingView: toggleBool,
        });
    };

    toggleFavorite = (listing) => {
        if (listing.isFavorite) {
            axios({
                method: "delete",
                url: `https://localhost:44332/favorites`,
                data: {
                    ListingId: listing.id,
                    UserId: this.state.currentUser.id,
                }
            }).then((response) => {
                var newListings = this.state.listings;
                newListings.map((oldListing) => {
                    if (oldListing.id == listing.id) {
                        oldListing.isFavorite = false;
                    }
                }
                );
                this.setState({ listings: newListings });
            }
            );
        } else {
            axios({
                method: "post",
                url: `https://localhost:44332/favorites`,
                data: {
                    ListingId: listing.id,
                    UserId: this.state.currentUser.id,
                }
            }).then((response) => {
                var newListings = this.state.listings;
                newListings.map((oldListing) => {
                    if (oldListing.id == listing.id) {
                        oldListing.isFavorite = true;
                    }
                }
                );
                this.setState({ listings: newListings });
            }
            );
        }
    };

    toggleDeleteListingView = (listing, toggleBool) => {
        this.setState({
            deletedListing: listing,
            deleteListingView: toggleBool,
        });
    };

    toggleCurrentUser = (user) => {
        this.setState({
            currentUser: user,
        });
    };

    componentDidMount() {
        this.toggleCurrentUser(this.getUser());
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                axios({
                    method: "get",
                    url: `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=default`,
                }).then((response) => {
                    this.setState({ city: response.data.city });
                    this.getListings(response.data.city);
                });
            });
        } else {
            this.getListings(null);
        }

        const pusher = new Pusher("ae5e63689c26a34fbdbf", {
            cluster: "mt1",
        });
        const channel = pusher.subscribe("listing_feed");
        const that = this;
        channel.bind("feed_updated", function (data) {
            that.getListings(that.state.city);
        });
    }

    getListings = (city) => {
        axios({
            method: "get",
            url: `https://localhost:44332/listing/sort?sort=0&city=${encodeURIComponent(
                city
            )}`,
        }).then((response) => {
            this.setState({ listings: response.data });
        });
    };

    deleteListing = (listing) => {
        axios({
            method: "delete",
            url: `https://localhost:44332/listing/delete`,
            data: listing,
        }).then((response) => {
            this.setState({ listings: response.data });
            console.log(response);
        });
    };

    getUser = () => {
        axios
            .get("https://localhost:44332/user/token", {
                params: {
                    token: localStorage.getItem("token"),
                },
            })
            .then((response) => {
                this.setState({
                    userFirstName: response.data.firstName,
                    userLastName: response.data.lastName,
                    currentUser: response.data,
                    userId: response.data.id,
                });
                console.log(response);
            });
    };

    getUserListings = () => {
        axios({
            method: "get",
            url: `https://localhost:44332/listing/userlistings`,
            params: {
                id: this.state.userId,
            },
        }).then((response) => {
            console.log(response);
            this.setState({ listings: response.data });
        });
    };

    getUserFavorites = () => {
        axios({
            method: "get",
            url: `https://localhost:44332/favorites`,
            params: {
                userId: this.state.userId,
            },
        }).then((response) => {
            console.log(response);
            this.setState({ listings: response.data });
        });
    };

    makeDropdown = () => {
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <NavDropdown title="My Account" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">My Profile</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">
                                My Listings
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">
                                My Messages
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.4">My Reviews</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                                My Account Settings
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.4">
                                My Account Privacy
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                                My Account Help
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.4">
                                My Account FAQ
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.4">
                                My Account Contact
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                                My Account Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    };
    render() {
        return (
            <>
                <motion.div
                    className="logged-in-main"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <FilterComponent updateListings={this.updateListings.bind(this)} />
                    <div className="logged-in-main-name" id="logged-in-main-name">
                        <btn2 className="all-listings-button" onClick={this.getListings}>
                            &nbsp;All Listings&nbsp;
                        </btn2>
                        <btn2
                            className="all-listings-button"
                            onClick={this.getUserListings}
                        >
                            &nbsp;My Listings&nbsp;
                        </btn2>
                        <btn2
                            className="all-listings-button"
                            onClick={this.getUserFavorites}
                        >
                            &nbsp;My Favorites&nbsp;
                        </btn2>
                        <img className="user-icon" src={img1} />:{this.state.userFirstName}{" "}
                        {this.state.userLastName}
                    </div>

                    <LogOutButton></LogOutButton>

                    <div
                        className={`logged-in-main-container ${this.state.createListingView && " create-listing-on"
                            }`}
                    >
                        {this.state.createListingView ? (
                            <CreateListingComponent
                                toggleCreateListing={this.toggleCreateListing}
                            />
                        ) : this.state.editListingView ? (
                            <EditListingComponent
                                listing={this.state.editedListing}
                                toggleEditListing={this.toggleEditListingView.bind(this)}
                            />
                        ) : this.state.deleteListingView ? (
                            <DeleteListingComponent
                                listing={this.state.deletedListing}
                                toggleDeleteListingView={this.toggleDeleteListingView.bind(
                                    this
                                )}
                                deleteListing={this.deleteListing}
                            />
                        ) : (
                            <div className="listings-container">
                                <>
                                    <CreateListingButton
                                        id="create-listing-button"
                                        text="New listing"
                                        class="create-listing-btn"
                                        onclick={this.toggleCreateListingWrapper.bind(this)}
                                    />
                                    {this.state.listings && (
                                        <ListOfListings
                                            listings={this.state.listings}
                                            toggleEditListingView={this.toggleEditListingView.bind(
                                                this
                                            )}
                                            toggleDeleteListingView={this.toggleDeleteListingView.bind(
                                                this
                                            )}
                                            toggleFavorite={this.toggleFavorite.bind(
                                                this
                                            )}
                                            currentUser={this.state.currentUser}
                                        />
                                    )}
                                </>
                            </div>
                        )}
                    </div>
                </motion.div>
            </>
        );
    }
}
