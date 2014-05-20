import QtQuick 2.2
import QtQuick.Controls 1.1
import QtQuick.Controls.Styles 1.1
import QtQuick.Dialogs 1.1
import QtQuick.Window 2.1
import "2048.js" as MyScript

ApplicationWindow {
    id: mainWindow
    visible: true
    width: 550
    height: 740
    title: qsTr("2048 Game");
//    flags: Qt.Window | Qt.WindowTitleHint  | Qt.WindowMinimizeButtonHint | Qt.WindowCloseButtonHint | Qt.CustomizeWindowHint

    x: (Screen.width - width) / 2
    y: (Screen.height - height) / 2

    ExclusiveGroup { id: labelSettingsGroup }
    ExclusiveGroup { id: languageSettingsGroup }

    menuBar: MenuBar {
        Menu {
            title: qsTr("File")
            MenuItem {
                text: qsTr("New Game")
                shortcut: "Ctrl+N"
                onTriggered: MyScript.startupFunction();
            }
            MenuItem {
                text: qsTr("Exit")
                shortcut: "Ctrl+Q"
                onTriggered: MyScript.cleanUpAndQuit();
            }
        }

        Menu {
            title: qsTr("Settings")
            Menu {
                title: qsTr("Labeling")
                MenuItem {
                    text: qsTr("2048")
                    checkable: true
                    exclusiveGroup: labelSettingsGroup
                    checked: MyScript.label === MyScript.labelOptions[0] ? true : false
                    onTriggered: {
                        if (MyScript.label !== MyScript.labelOptions[0]) {
                            MyScript.label = MyScript.labelOptions[0];
                            MyScript.startupFunction();
                        }
                    }
                }
                MenuItem {
                    text: qsTr("Degree")
                    checkable: true
                    exclusiveGroup: labelSettingsGroup
                    checked: MyScript.label === MyScript.labelOptions[1] ? true : false
                    onTriggered: {
                        if (MyScript.label !== MyScript.labelOptions[1]) {
                            MyScript.label = MyScript.labelOptions[1];
                            MyScript.startupFunction();
                        }
                    }
                }
                MenuItem {
                    text: qsTr("Military Rank")
                    checkable: true
                    exclusiveGroup: labelSettingsGroup
                    checked: MyScript.label === MyScript.labelOptions[2] ? true : false
                    onTriggered: {
                        if (MyScript.label !== MyScript.labelOptions[2]) {
                            MyScript.label = MyScript.labelOptions[2];
                            MyScript.startupFunction();
                        }
                    }
                }
                MenuItem {
                    text: qsTr("PRC")
                    checkable: true
                    exclusiveGroup: labelSettingsGroup
                    checked: MyScript.label === MyScript.labelOptions[3] ? true : false
                    onTriggered: {
                        if (MyScript.label !== MyScript.labelOptions[3]) {
                            MyScript.label = MyScript.labelOptions[3];
                            MyScript.startupFunction();
                        }
                    }
                }
            }
            Menu {
                title: qsTr("Language")
                MenuItem {
                    text: qsTr("English")
                    checkable: true
                    exclusiveGroup: languageSettingsGroup
                    checked: settings.value("language") === "en_US" ? true : false
                    onTriggered: {
                        if (settings.value("language") !== "en_US") {
                            settings.setValue("language", "en_US");
                            changeLanguageDialog.open();
                        }
                    }
                }
                MenuItem {
                    text: qsTr("Russian")
                    checkable: true
                    exclusiveGroup: languageSettingsGroup
                    checked: settings.value("language") === "ru_RU" ? true : false
                    onTriggered: {
                        if (settings.value("language") !== "ru_RU") {
                            settings.setValue("language", "ru_RU");
                            changeLanguageDialog.open();
                        }
                    }
                }
                MenuItem {
                    text: qsTr("Simplified Chinese")
                    checkable: true
                    exclusiveGroup: languageSettingsGroup
                    checked: settings.value("language") === "zh_CN" ? true : false
                    onTriggered: {
                        if (settings.value("language") !== "zh_CN") {
                            settings.setValue("language", "zh_CN");
                            changeLanguageDialog.open();
                        }
                    }
                }
            }
        }

        Menu {
            id: helpMenu
            title: qsTr("Help")
            MenuItem {
                text: qsTr("About")
                onTriggered: aboutDialog.open();
            }
            MenuItem {
                text: qsTr("About Qt")
                onTriggered: myClass.aboutQt();
            }
        }
    }


    Item {
        id: helper
        focus: false
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

        MouseArea {
            anchors.fill: parent
            onClicked: parent.forceActiveFocus()
        }

        FontLoader { id: localFont; source: "qrc:///fonts/DroidSansFallback.ttf" }

        Text {
            id: gameName
            font.family: localFont.name
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
                        text: (index == 0) ? qsTr("SCORE") : qsTr("BEST")
                        anchors.horizontalCenter: parent.horizontalCenter
                        y: 6
                        font.family: localFont.name
                        font.pixelSize: 13
                        color: helper.myColors.fglight
                    }
                    Text {
                        text: scoreText
                        anchors.horizontalCenter: parent.horizontalCenter
                        y: 22
                        font.family: localFont.name
                        font.pixelSize: 25
                        font.bold: true
                        color: "white"
                    }
                }
            }

            Text {
                id: addScoreText
                font.family: localFont.name
                font.pixelSize: 25
                font.bold: true
                color: Qt.rgba(119/255, 110/255, 101/255, 0.9);
//                parent: scoreBoard.itemAt(0)
                anchors.horizontalCenter: parent.horizontalCenter

                property bool runAddScore: false
                property real yfrom: 0
                property real yto: -(parent.y + parent.height)
                property int addScoreAnimTime: 600

                ParallelAnimation {
                    id: addScoreAnim
                    running: false

                    NumberAnimation {
                        target: addScoreText
                        property: "y"
                        from: addScoreText.yfrom
                        to: addScoreText.yto
                        duration: addScoreText.addScoreAnimTime

                    }
                    NumberAnimation {
                        target: addScoreText
                        property: "opacity"
                        from: 1
                        to: 0
                        duration: addScoreText.addScoreAnimTime
                    }
                }
            }
        }

        Text {
            id: banner
            y: 90
            height: 40
            text: qsTr("Join the numbers and get to the <b>2048 tile</b>!")
            color: helper.myColors.fgdark
            font.family: localFont.name
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
                        text: qsTr("New Game")
                        color: helper.myColors.fgbutton
                        font.family: localFont.name
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
                id: tileGrid
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
                    }
                }
            }
        }

        MessageDialog {
            id: changeLanguageDialog
            title: qsTr("Language Setting Hint")
            text: qsTr("Please restart the program to make the language setting take effect.")
            standardButtons: StandardButton.Ok
        }

        MessageDialog {
            id: aboutDialog
            title: qsTr("About 2048-Qt")
            text: qsTr("<p style='font-weight: bold; font-size: 24px'>2048-Qt</p><p>Version " + settings.getVersion() + "</p><p>2014 Qiaoyong Zhong &lt;solary.sh@gmail.com&gt;</p>")
            standardButtons: StandardButton.Ok
        }

        MessageDialog {
            id: deadMessage
            title: qsTr("Game Over")
            text: qsTr("Game Over!")
            standardButtons: StandardButton.Retry | StandardButton.Abort
            onAccepted: {
                MyScript.startupFunction();
            }
            onRejected: MyScript.cleanUpAndQuit();
        }

        MessageDialog {
            id: winMessage
            title: qsTr("You Win")
            text: qsTr("You win! Continue playing?")
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

    }

    Component.onCompleted: MyScript.startupFunction();
}
