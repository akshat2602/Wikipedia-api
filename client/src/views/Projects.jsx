import {
    Grid,
    GridItem,
    Box,
    Text,
    useColorModeValue,
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Input,
    Select,
    ModalFooter,
    ModalContent,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SwitchThemeButton } from "../components/Util/SwitchTheme";
import axios from "axios";
function Projects(props) {
    const [state, setState] = useState();
    const bg = useColorModeValue("light.100", "dark.100");
    const fg = useColorModeValue("light.200", "dark.200");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newProject, setNewProject] = useState({
        wiki_title: "",
        fk_target_lang: undefined,
    });
    const createProject = async () => {
        await axios.post("http://localhost:8000/projects/", newProject);
        fetchProjects();
        onClose();
    };
    const deleteProject = async (project_id) => {
        await axios.delete("http://localhost:8000/projects/" + project_id);
        fetchProjects();
    };
    const fetchProjects = async () => {
        const response = await axios.get("http://localhost:8000/projects/");
        setState(response.data);
    };
    const onChange = (e, type) => {
        if (type === "title") {
            setNewProject({ ...newProject, wiki_title: e.target.value });
        } else {
            setNewProject({ ...newProject, fk_target_lang: e.target.value });
        }
    };
    useEffect(() => {
        fetchProjects();
    }, []);
    return (
        <Box pt="2%" bg={fg}>
            <Text fontSize={"3xl"} fontWeight={"bold"}>
                Your Projects
            </Text>

            {state &&
                state.map((element, index) => (
                    <Grid templateColumns="repeat(12, 1fr)">
                        <GridItem
                            // minHeight={"15vh"}
                            m="5%"
                            p="2%"
                            pt="5%"
                            colSpan={12}
                            bg={bg}
                            borderRadius={"xl"}
                            boxShadow={"lg"}
                        >
                            <Text fontSize={"xl"} fontWeight="bold">
                                {element.wiki_title}
                            </Text>
                            <Text fontSize={"lg"}>{element.language_name}</Text>
                            <Link to={`projects/${element.id}`}>
                                <Button mt="5%">Open Project</Button>
                            </Link>
                            <Button
                                mt="5%"
                                ml="3%"
                                colorScheme="red"
                                onClick={() => deleteProject(element.id)}
                            >
                                <SmallCloseIcon />
                            </Button>
                        </GridItem>
                    </Grid>
                ))}
            <Button onClick={onOpen} mr=".8%">
                +
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Project</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Input
                            value={newProject.wiki_title}
                            mb="3%"
                            placeholder="Wikipedia Page Title"
                            onChange={(e) => onChange(e, "title")}
                        />
                        <Select
                            onChange={(e) => onChange(e, "select")}
                            placeholder="Select Translation Language"
                        >
                            {props.languages &&
                                props.languages.map((element) => (
                                    <option value={element.language_id}>
                                        {element.name}
                                    </option>
                                ))}
                        </Select>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={createProject} mr={3}>
                            Save
                        </Button>
                        <Button onClick={onClose} variant={"ghost"}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <SwitchThemeButton />
        </Box>
    );
}

export default Projects;
