export default function df1_main() {
    return (
    <html>
    <head>
    <meta charset = "utf-8" >
    <title> Bee forum homepage </title>
    <link rel="stylesheet" href="https://cdn.staticfile.org/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
        <script src="https://cdn.staticfile.org/jquery/2.1.1/jquery.min.js"></script>
        <script src="https://cdn.staticfile.org/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
        <style>
            .fakeimg {
            height: 200px;
            background: #aaa;
        }

            .imgs {
            display: inline-block;
            vertical-align: middle;
        }

            .modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 9999;
        }
            /* Custom styles to change background and font colors */
            .navbar-inverse {
            background - color: white;
            color: black;
        }

            .navbar-inverse .navbar-nav > li > a {
            color: black;
        }

            .navbar-inverse .navbar-nav > li > a:hover,
            .navbar-inverse .navbar-nav > li > a:focus {
            color: black;
            background-color: #f5f5f5;
        }

            .navbar-inverse .navbar-toggle {
            border - color: #333;
        }

            .navbar-inverse .navbar-toggle:hover,
            .navbar-inverse .navbar-toggle:focus {
            background - color: #333;
        }

            .navbar-inverse .navbar-toggle .icon-bar {
            background - color: #333;
        }

            .navbar-inverse .navbar-toggle:hover .icon-bar,
            .navbar-inverse .navbar-toggle:focus .icon-bar {
            background - color: #fff;
        }

            .navbar-inverse .navbar-form {
            border - color: #333;
        }

            .navbar-inverse .navbar-form .btn-default {
            color: black;
        }

            .navbar-inverse .navbar-form .btn-default:hover,
            .navbar-inverse .navbar-form .btn-default:focus {
            color: black;
            background-color: #f5f5f5;
        }

            .navbar-inverse .navbar-brand {
            color: black;
        }

            .navbar-inverse .navbar-brand:hover,
            .navbar-inverse .navbar-brand:focus {
            color: black;
        }

            .navbar-inverse .navbar-nav .open .dropdown-menu > li > a {
            color: black;
        }

            .navbar-inverse .navbar-nav .open .dropdown-menu > li > a:hover,
            .navbar-inverse .navbar-nav .open .dropdown-menu > li > a:focus {
            color: black;
            background-color: #f5f5f5;
        }

            .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a,
            .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a:hover,
            .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a:focus {
            color: #333030;
            background-color: transparent;
        }

            .modal {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #f9f9f9;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            z-index: 10000;
        }

            .modal .close {
            cursor: pointer;
            float: right;
            font-size: 20px;
            font-weight: bold;
        }
        </style>
    </head>
    <body>
    <nav class="navbar navbar-inverse" style="background: white">
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>

                <a class="navbar-brand" style="color: black" href="#">
                    <div class="imgs"><img
                        src="/static/u0.png"
                        alt="bee" width="40" height="36"></div>
                    Bee Aware Forum</a>
            </div>
            <div class="collapse navbar-collapse" id="myNavbar">
                <ul class="nav navbar-nav">
                    <li><a href="{{ url_for('qa.index') }}">Homepage</a></li>
                    <li><a href="{{ url_for('qa.public_my_post') }}">My post</a></li>
                    <li><a href="{{ url_for('qa.save') }}">My save</a></li>
                    <li><a href="{{ url_for('qa.public_qa') }}">post</a></li>
                </ul>


                <button type="button" class="btn btn-primary me-2"
                        style="float:right;background-color:firebrick;color: white;"><a
                    href="{{ url_for('auth.login') }}">Log
                    in</a></button>
                <button type="button" class="btn btn-success"
                        style="float:right;background-color: darkgoldenrod;color: white;"><a
                    href="{{ url_for('auth.register') }}">Register</a></button>
                <div class="btn-group">
                    <button type="button" class="btn btn-default dropdown-toggle"
                            style="float:right; background-color: black; color: gray;" data-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false">
                        My Account <span class="caret"></span></button>
                    <ul class="dropdown-menu">
                        <li><a href="{{ url_for('qa.history') }}">History</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="{{ url_for('qa.profile') }}">User account</a></li>
                    </ul>
                </div>
            </div>
        </div>

        <form class="navbar-form navbar-left" role="search" method="GET" action="{{ url_for('qa.searchinhome') }}">
            <div class="form-group">
                <input type="text" class="form-control" placeholder="Search" name="q">
            </div>
            <button type="submit" class="btn btn-default">Submit</button>
        </form>


    </nav>
    <div style="text-align: center ;">
        <h1><b>Bee Forum</b></h1>
    </div>
    <br>
        <br>

            <div class="container">
                <div class="row">
                    <div class="col-sm-4">
                        <form method="POST" action="{{ url_for('qa.index') }}">
                            <h2>Hot post</h2>
                            <button type="submit" name="functionality" value="likes" autofocus>Likes</button>
                            <button type="submit" name="functionality" value="view">View</button>
                            <ul>
                                {% for question in hot_posts[:3] %}
                                <li><h3>#{{question.title}}:</h3></li>
                                <h3>likes:{{question.NumOfLikes}}/view:{{question.NumOfView}}</h3>
                                {% endfor %}
                            </ul>
                        </form>
                        <hr class="hidden-sm hidden-md hidden-lg">

                    </div>


                    <div class="dropdown" style='float: right;font-size: larger;'>
                        <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1"
                                data-toggle="dropdown"
                                aria-haspopup="true" aria-expanded="true">
                            category
                            <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                            <li class="active"><a href="#">000</a></li>
                            <li><a href="#">111</a></li>
                            <li><a href="#">222</a></li>
                            <li role="separator" class="divider"></li>
                            <li><a href="#">Other</a></li>
                        </ul>
                    </div>
                    <div class="col-sm-8">
                        <br>
                            <br>

                                <ul class="question-ul">
                                    {% for question in questions %}
                                    <li>
                                        <table width="100%" border="0%">
                                            <td colspan="0" style="background-color:ghostwhite;">
                                                <h1>{{question.title}}</h1>
                                                <a href="{{ url_for('qa.qa_like', qa_id=question.id) }}"
                                                   style="float: right">Like</a>
                                                <br>
                                                    <a href="{{ url_for('qa.qa_dislike', qa_id=question.id) }}"
                                                       style="float: right">Dislike</a>
                                                    <h3>{{question.content}}</h3>
                                                    <br>
                                                        <div>
                                                            <!--<img src="b.jpg" alt="head portrait"width="80%" height="100%">-->
                                                            <p style="font-size: larger">Author:{{
                                                                question
                                                                .author.username
                                                            }}</p>
                                                            <p style="font-size: larger">Date:{{
                                                                question
                                                                .create_Time
                                                            }}</p>
                                                            <p style="font-size: larger">view: {{
                                                                question
                                                                .NumOfView
                                                            }}</p>
                                                            <p style="font-size:larger">likes: {{
                                                                question
                                                                .NumOfLikes
                                                            }}</p>
                                                            <br>
                                                                <p><a onclick="confirmSave()"
                                                                      href="{{ url_for('qa.qa_clicksave', qa_id=question.id) }}"
                                                                      class="btn btn-primary btn-lg" role="button"
                                                                      style="float:right;">Save</a></p>
                                                                <br>

                                                                    <script>
                                                                        function confirmSave() {
                                                                        var result = confirm("Save the post");
                                                                        if (result) {
                                                                    }
                                                                    }
                                                                    </script>
                                                                    <br>
                                                                        <p><a class="btn btn-primary btn-lg"
                                                                              href="{{ url_for('qa.qa_detail', qa_id=question.id) }}"
                                                                              role="button"
                                                                              style="float:right;">Learn more about
                                                                            it</a></p>
                                                                        <br>
                                                                            <br>
                                                        </div>
                                            </td>

                                        </table>
                                    </li>
                                    <br>
                                        <br>
                                            {% endfor %}

                                </ul>


                    </div>


                    <div class="jumbotron text-center" style="margin-bottom:0">
                        <nav aria-label="Page navigation">
                            <ul class="pagination">
                                <div class="jumbotron text-center" style="margin-bottom:0">
                                    <nav aria-label="Page navigation">
                                        <ul class="pagination">

                                            <!--!-->
                                            {% if questions.has_prev %}
                                            <li>
                                                <a href="{{ url_for('qa.index', page=questions.prev_num) }}"
                                                   aria-label="Previous">
                                                    <span aria-hidden="true">&laquo;</span>
                                                </a>
                                            </li>
                                            {% endif %}

                                            {% for page_num in questions.iter_pages(left_edge=1, right_edge=1, left_current=1, right_current=2) %}
                                            {% if page_num %}
                                            {% if questions.page == page_num %}
                                            <li class="active"><span>{{page_num}}</span></li>
                                            {% else %}
                                            <li><a href="{{ url_for('qa.index', page=page_num) }}">{{page_num}}</a>
                                            </li>
                                            {% endif %}
                                            {% else %}
                                            <li class="disabled"><span>...</span></li>
                                            {% endif %}
                                            {% endfor %}

                                            {% if questions.has_next %}
                                            <li>
                                                <a href="{{ url_for('qa.index', page=questions.next_num) }}"
                                                   aria-label="Next">
                                                    <span aria-hidden="true">&raquo;</span>
                                                </a>
                                            </li>
                                            {% endif %}

                                            <!--!-->
                                        </ul>
                                    </nav>
                                </div>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

            <div class="modal-overlay" id="modalOverlay1">
                <div class="modal" id="modal1">
                    <span class="close" onclick="closeModal(1)">&times;</span>
                    <h2>Privacy Policy</h2>
                    <p>Welcome to our forum! We value your privacy and are committed to protecting your personal
                        information. Here's
                        a brief overview of how we collect and use information:</p>
                    <p>1.Secure Data: We employ industry-standard security measures to safeguard your data and protect
                        it from
                        unauthorized access.</p>
                    <p>2.Data Retention: Your personal information will only be retained for as long as necessary to
                        fulfill the
                        purposes for which it was collected.</p>
                    <p>3.Account Management: You have the right to update or delete your account information at any
                        time.</p>
                    <p>4.Email Communication: We may occasionally send you emails related to forum updates,
                        announcements, or
                        important account information.</p>
                    <p>5.Age Restriction: Our forum is intended for users of a certain age or older. Please refer to our
                        Terms of
                        Service for specific age requirements.</p>
                    <p>6.Third-Party Links: We are not responsible for the privacy practices or content of third-party
                        websites
                        linked to from our forum.</p>
                    <p>7.Changes to Privacy Policy: Any updates to our privacy policy will be posted on this page.</p>
                    <p>If you have any questions or concerns regarding our privacy practices, feel free to contact us.
                        Thank you for
                        being a part of our forum community!</p>
                </div>
            </div>

            <div class="modal-overlay" id="modalOverlay2">
                <div class="modal" id="modal2">
                    <span class="close" onclick="closeModal(2)">&times;</span>
                    <h2>Forum Rules</h2>
                    <p>
                        <p>1.Be Respectful: Treat all members with courtesy and respect. Avoid offensive language,
                            personal attacks, and
                            discrimination of any kind.</p>
                        <p>2.Stay on Topic: Keep discussions relevant to the forum's theme and avoid going
                            off-topic.</p>
                        <p>3.No Spamming: Do not post promotional content or spam the forum with irrelevant links or
                            messages.</p>
                        <p>4.Avoid Plagiarism: Always give credit to the original source when sharing content from
                            external
                            websites.</p>
                        <p>5.Be Safe: Avoid sharing sensitive personal information publicly. Use private messaging for
                            confidential
                            discussions.</p>
                        <p>6.Report Misconduct: If you encounter any violations of these rules or inappropriate
                            behavior, report it to
                            the forum moderators.</p>
                        <p>7.No Illegal Content: Do not post or share any illegal, harmful, or offensive content on the
                            forum.</p>
                        <p>8.Respect Privacy: Refrain from sharing other members' personal information without their
                            consent.</p>
                        <p>9.No Trolling: Do not engage in disruptive behavior or intentionally provoke others.</p>
                        <p>10.Follow Moderator Instructions: Comply with the instructions and decisions of the forum
                            moderators.</p>
                        <p>Remember, our forum is a community where everyone should feel safe and respected. Enjoy your
                            discussions and
                            have a great time!</p></p>
                </div>
            </div>

            <script>
                // Check if the modal has been shown before
                const hasModalBeenShown = localStorage.getItem('modalShown');

                const modalOverlay1 = document.getElementById('modalOverlay1');
                const modal1 = document.getElementById('modal1');
                const modalOverlay2 = document.getElementById('modalOverlay2');
                const modal2 = document.getElementById('modal2');

                function showModal1() {
                return new Promise((resolve) => {
                modalOverlay1.style.display = 'block';
                modal1.style.display = 'block';
                setTimeout(resolve, 2000); // Delay the second modal by 2 seconds
            });
            }

                function showModal2() {
                modalOverlay2.style.display = 'block';
                modal2.style.display = 'block';
            }

                function closeModal(modalNumber) {
                if (modalNumber === 1) {
                modalOverlay1.style.display = 'none';
                modal1.style.display = 'none';
                showModal2();
            } else if (modalNumber === 2) {
                modalOverlay2.style.display = 'none';
                modal2.style.display = 'none';
            }
            }

                window.onload = async function () {
                if (!hasModalBeenShown) {
                await showModal1();
                localStorage.setItem('modalShown', 'true');
            }
            };
            </script>
    </body>
</html>
)
}
