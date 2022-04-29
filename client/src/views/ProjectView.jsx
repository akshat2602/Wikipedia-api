import {
  Grid,
  GridItem,
  Box,
  Text,
  useColorModeValue,
  Button,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
export default function ProjectView(props) {
  const [state, setState] = useState();
  const fg = useColorModeValue("light.200", "dark.200");
  let { projectID } = useParams();
  const updateSentence = async (sentence_id) => {
    const response = await axios.patch(
      `http://localhost:8000/sentence/update/${sentence_id}`,
      {
        translated_sentence: state["sentences"].find(
          (el) => el.id === sentence_id
        )["translated_sentence"],
      }
    );
    if (response.status === 200) {
      fetchProject();
    }
  };
  const onChange = (e, sentence_id) => {
    let sentences = state["sentences"];
    setState({
      ...state,
      sentences: sentences.map((el) => {
        return el.id === sentence_id
          ? { ...el, translated_sentence: e }
          : el;
      }),
    });
  };
  const fetchProject = async () => {
    const response = await axios.get(
      "http://localhost:8000/projects/" + projectID
    );
    if (response.status === 200) {
      setState(response.data);
      console.log(response.data);
    }
  };
  useEffect(() => {
    fetchProject();

    // eslint-disable-next-line
  }, [props]);
  useEffect(() => {
    console.log(state);
  }, [state]);
  return (
    <Box h="100vh" pt="2%" bg={fg}>
      <Text fontSize={"3xl"} fontWeight={"bold"}>
        {state && state["wiki_title"]}
      </Text><Text fontSize={"xl"} >
        {state && state["language_name"]}
      </Text>
      {state &&
        state["sentences"].map((element) => (
          <Grid templateColumns="repeat(2, 1fr)">
            <GridItem colSpan={1}>
              <Box px="8%" py="1%">
                <Text textAlign={"left"}>{element["original_sentence"]}</Text>
              </Box>
            </GridItem>

            <GridItem colSpan={1}>
              <Box px="8%" py="1%">
                <Grid templateColumns="repeat(12,1fr)">
                  <GridItem colSpan={9}>
                    <ReactTransliterate
                      renderComponent={(props) => {
                        return <Input {...props} />;
                      }}
                      value={element["translated_sentence"]}
                      onChangeText={(e) => {
                        onChange(e, element["id"]);
                      }}
                      style={{ width: "100%" }}
                      lang={state["language_code"]}
                      placeholder="Start typing here..."
                      id="react-transliterate-input"
                    />
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Button
                      onClick={() => updateSentence(element["id"])}
                    >
                      Update
                    </Button>
                  </GridItem>
                </Grid>
              </Box>
            </GridItem>
          </Grid>
        ))}
    </Box>
  );
}
