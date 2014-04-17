import QtQuick 2.2
import QtQuick.Controls 1.1
import QtQuick.Controls.Styles 1.1
import QtQuick.Dialogs 1.1
import QtQuick.Window 2.1
import "2048.js" as MyScript

ApplicationWindow {
    visible: true
    width: 560
    height: 730
    title: qsTr("2048 Game");

    x: (Screen.width - width) / 2
    y: (Screen.height - height) / 2

    Item {
        id: helper
        property var myColors: {"bglight": "#FAF8EF",
                                "bggray": Qt.rgba(238/255, 228/255, 218/255, 0.35),
                                "bgdark": "#BBADA0",
                                "fglight": "#EEE4DA",
                                "fgdark": "#776E62",
                                "bgbutton": "#8F7A66", // Background color for the "New Game" button
                                "fgbutton": "#F9F6F2" // Foreground color for the "New Game" button
        }
    }
    color: helper.myColors.bglight

    Item {
        width: 500
        height: 670
        anchors.centerIn: parent

        focus: true
        Keys.onPressed: MyScript.moveKey(event)

        Text {
            id: gameName
            font.pixelSize: 55
            font.bold: true
            text: "2048"
            color: helper.myColors.fgdark
        }

        Row {
            anchors.right: parent.right
            spacing: 5
            Repeater {
                id: scoreBoard
                model: 2
                Rectangle {
                    width: (index == 0) ? 95 : 125
                    height: 55
                    radius: 3
                    color: helper.myColors.bgdark
                    property string scoreText: (index === 0) ? MyScript.score.toString() : MyScript.bestScore.toString()
                    Text {
                        text: (index == 0) ? "SCORE" : "BEST"
                        anchors.horizontalCenter: parent.horizontalCenter
                        y: 7
                        font.pixelSize: 13
                        color: helper.myColors.fglight
                    }
                    Text {
                        text: scoreText
                        anchors.horizontalCenter: parent.horizontalCenter
                        y: 25
                        font.pixelSize: 25
                        font.bold: true
                        color: "white"
                    }
                }
            }
        }

        Text {
            id: banner
            y: 90
            height: 40
            text: "Join the numbers and get to the <b>2048 tile!</b>"
            color: helper.myColors.fgdark
            font.pixelSize: 16
            verticalAlignment: Text.AlignVCenter
        }

        Button {
            width: 129
            height: 40
            y: 90
            anchors.right: parent.right

            style: ButtonStyle {
                background: Rectangle {
                    color: helper.myColors.bgbutton
                    radius: 3
                    Text{
                        anchors.centerIn: parent
                        text: "New Game"
                        color: helper.myColors.fgbutton
                        font.pixelSize: 18
                        font.bold: true
                    }
                }
            }
            onClicked: MyScript.startupFunction()
        }

        Rectangle {
            y: 170
            width: 500
            height: 500
            color: helper.myColors.bgdark
            radius: 6

            Grid {
                x: 15;
                y: 15;
                rows: 4; columns: 4; spacing: 15

                Repeater {
                    id: cells
                    model: 16
                    Rectangle {
                        width: 425/4; height: 425/4
                        radius: 3
                        color: helper.myColors.bggray
                        property string tileText: ""
                        property int tileFontSize: 55
                        property color tileColor: helper.myColors.fgdark

                        Text {
                            text: tileText
                            color: tileColor
                            font.pixelSize: tileFontSize
                            font.bold: true
                            anchors.centerIn: parent
                        }
                    }
                }
            }
        }


        MessageDialog {
            id: deadMessage
            title: "Game Over"
            text: "Game Over"
            standardButtons: StandardButton.Retry | StandardButton.Abort
            onAccepted: {
                MyScript.startupFunction();
            }
            onRejected: {
                Qt.quit();
            }
        }

        MessageDialog {
            id: winMessage
            title: "You Win"
            text: "You win! Continue playing?"
            standardButtons: StandardButton.Yes | StandardButton.No
            onYes: {
                MyScript.checkTargetFlag = false;
                close()
            }
            onNo: MyScript.startupFunction()
            onRejected: {
                MyScript.checkTargetFlag = false;
                close()
            }
        }

        Component.onCompleted: MyScript.startupFunction()
    }
}
