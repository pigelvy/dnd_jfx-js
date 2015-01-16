import javafx.application.Application;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.geometry.Orientation;
import javafx.geometry.Pos;
import javafx.scene.Group;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.SnapshotParameters;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.ListView;
import javafx.scene.control.SelectionMode;
import javafx.scene.control.SplitPane;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.image.Image;
import javafx.scene.input.ClipboardContent;
import javafx.scene.input.DataFormat;
import javafx.scene.input.Dragboard;
import javafx.scene.input.TransferMode;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.scene.shape.Rectangle;
import javafx.scene.text.Font;
import javafx.scene.text.Text;
import javafx.scene.web.WebView;
import javafx.stage.Screen;
import javafx.stage.Stage;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
import java.util.Arrays;

import static java.lang.String.format;

public class Main extends Application {
    private static final DataFormat MIME_PERSON = new DataFormat("text/CustomPerson");

    public static void main(String[] args) {
        Application.launch(args);
    }

    private final ObservableList<Person> listViewObservableList = FXCollections.observableArrayList(
        new Person("jerry", "seinfled"),
        new Person("george", "costanza"),
        new Person("elaine", "benes"),
        new Person("kramer", "cosmo")
    );

    private final ListView<Person> personListView = new ListView<>(listViewObservableList);
    private final WebView personWebView = new WebView();
    private final TextField firstName = new TextField();
    private final TextField lastName = new TextField();
    private final TextArea textArea = new TextArea("This is a JavaFX TextArea");

    @Override
    public void start(Stage mainStage) throws Exception {
        mainStage.setTitle("JavaFX & HTML5 - D'n'D test");

        {
            final URL resource = getClass().getClassLoader().getResource("www/persons.html");
            personWebView.getEngine().load(resource.toExternalForm());
        }

        final SplitPane westernSplitPane = new SplitPane();
        westernSplitPane.setOrientation(Orientation.VERTICAL);
        westernSplitPane.getItems().addAll(createJfxPersonList(), textArea);

        final SplitPane splitPane = new SplitPane();
        splitPane.getItems().addAll(westernSplitPane, personWebView);
        splitPane.setDividerPositions(0.2);

        final Scene scene = new Scene(splitPane);
        final URL jfxCssUrl = getClass().getResource("jfx.css");
        scene.getStylesheets().add(jfxCssUrl.toString());
        mainStage.setScene(scene);
        mainStage.setX(0);
        mainStage.setY(0);
        mainStage.setHeight(800);
        mainStage.setWidth(Screen.getPrimary().getVisualBounds().getWidth());
        mainStage.show();
    }

    private Node createJfxPersonList() {
        personListView.getSelectionModel().setSelectionMode(SelectionMode.SINGLE);
        personListView.setCellFactory(param -> new PersonCell());
        personListView.setOnDragDetected(
            event -> {
                System.out.println("Drag Detected on Jfx ListView : " + event);

                final ListView<Person> listView = (ListView<Person>) event.getSource();

                final Person selectedPerson = listView.getSelectionModel().getSelectedItem();

                if (selectedPerson == null) {
                    return;
                }

                final String firstName = selectedPerson.firstName.getValueSafe();
                final String lastName = selectedPerson.lastName.getValueSafe();

                final ClipboardContent content = new ClipboardContent();

                content.putString("Mr " + lastName + " " + firstName);

                final Rectangle rectangle = new Rectangle();
                rectangle.setId("dndRec");
                rectangle.setWidth(200);
                rectangle.setHeight(200);
                rectangle.setFill(Color.DARKORANGE);
                // todo : how to style through CSS (inlined or better, in file) ???
//                rectangle.setStyle("-fx-fill: darkorange;");
                final Text text = new Text(firstName + " " + lastName);
                text.setId("dndText");
                text.setFill(Color.WHITE);

                final StackPane group = new StackPane();
                group.setAlignment(Pos.CENTER);
                group.getChildren().add(rectangle);
                group.getChildren().add(text);

                final Image drawViewImage = group.snapshot(new SnapshotParameters(), null);
                content.putImage(drawViewImage);

                final String personStringified = format(
                    "Person{firstName:%s,lastName:%s}",
                    firstName,
                    lastName
                );
                content.put(MIME_PERSON, personStringified);

                try {
                    final File personFile = File.createTempFile(firstName + "_" + lastName, ".txt");
                    personFile.deleteOnExit();
                    final FileOutputStream fileOutputStream = new FileOutputStream(personFile);
                    fileOutputStream.write(personStringified.getBytes());
                    fileOutputStream.close();
                    content.putFiles(Arrays.asList(personFile));
                } catch (IOException e) {
                    e.printStackTrace();
                }

                final Dragboard dragboard = listView.startDragAndDrop(TransferMode.COPY);
                dragboard.setDragView(drawViewImage);

                dragboard.setContent(content);
                event.consume();
            }
        );

        final VBox result = new VBox(10);
        result.getChildren().add(new Label("New person :"));
        result.getChildren().add(createPersonCreatorNode());
        result.getChildren().add(personListView);
        VBox.setVgrow(personListView, Priority.ALWAYS);

        return result;
    }

    private Node createPersonCreatorNode() {
        final VBox vBox = new VBox(5);
        vBox.setAlignment(Pos.TOP_RIGHT);

        final Button createPersonButton = new Button("create person");

        final HBox firstNameHBox = new HBox();
        final Label firstNameLabel = new Label("First name :");
        firstNameLabel.setLabelFor(firstName);
        firstNameHBox.getChildren().add(firstNameLabel);
        firstNameHBox.getChildren().add(firstName);
        HBox.setHgrow(firstName, Priority.ALWAYS);
        vBox.getChildren().add(firstNameHBox);

        final HBox lastNameHBox = new HBox();
        final Label lastNameLabel = new Label("Last name :");
        lastNameLabel.setLabelFor(lastNameLabel);
        lastNameHBox.getChildren().add(lastNameLabel);
        lastNameHBox.getChildren().add(lastName);
        HBox.setHgrow(lastName, Priority.ALWAYS);
        vBox.getChildren().add(lastNameHBox);

        vBox.getChildren().add(createPersonButton);

        createPersonButton.setOnAction(event -> Main.this.onPersonCreationRequested());

        return vBox;
    }

    private void onPersonCreationRequested() {
        final String firstName = this.firstName.getText().trim();
        final String lastName = this.lastName.getText().trim();

        if (firstName.isEmpty()) {
            return;
        }

        if (lastName.isEmpty()) {
            return;
        }

        final Person person = new Person(firstName, lastName);
        this.firstName.setText(null);
        this.lastName.setText(null);

        listViewObservableList.add(person);
    }
}
