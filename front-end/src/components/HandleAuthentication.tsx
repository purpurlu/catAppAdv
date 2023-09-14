import { Button, ButtonGroup, Input, Box, Text, FormControl, FormErrorMessage, Flex, FormLabel } from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/Context'
import { ServerResponse } from '../helpers/interfaces'

export interface AuthenticationProps {
    title: string,
    action: (username:string, password:string) => Promise<ServerResponse>
    path: string
}

export const HandleAuthentication = (props: AuthenticationProps): React.JSX.Element => {

    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState<string>("")

    const { isLoggedIn } = useContext(AuthContext)

    useEffect(() => {
        if(isLoggedIn) {
            navigate("/")
        }
    }, [isLoggedIn])

    const handleEvent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        const username = data.get('username')?.toString()
        const password = data.get('password')?.toString()
        console.log(data.get("username"))

        const res = await props.action(username!, password!)
        if (res.success) {
            setErrorMessage("")
            // alert("Success!")
            navigate(props.path)
        } else {
            setErrorMessage(res.errorMessage!)
        }
    }

    return (
        <Flex justifyContent={"center"} alignItems={"center"} p="4"> 
            <Box w="100%" className="signup">
                <Text fontSize={"2xl"} fontWeight={"bold"} textAlign={'center'} textColor={"yellow"} margin={"10px"}> {props.title} Page </Text>
                <Flex justifyContent={"center"} alignItems={"center"}>
                    <Box  w={["100%", "100%", "50%"]} p={4} color='white'>
                        <form 
                        onSubmit={handleEvent}
                        >
                            <Box p={4} m="5px">
                                <FormControl isInvalid={errorMessage ? true : false}>
                                    <FormLabel m="10px"> Username </FormLabel>
                                    <Input required 
                                    type="text" 
                                    name="username" 
                                    placeholder="Username" 
                                    _placeholder={{textAlign: "left"}}
                                    width={"100%"}
                                    m="10px"
                                    />
                                    <FormLabel m="10px"> Password </FormLabel>
                                    <Input required 
                                    type='password' 
                                    name="password" 
                                    placeholder="Password" 
                                    _placeholder={{textAlign: "left"}}
                                    width={"100%"}
                                    m="10px"
                                    />
                                    <ButtonGroup m="10px" w="100%" justifyContent={"center"}>
                                        <Button type="reset" w="50%"> Reset </Button>
                                        <Button type="submit" w="50%" > {props.title} </Button>
                                    </ButtonGroup>
                                    {
                                        errorMessage && 
                                        <FormErrorMessage 
                                        color="black"
                                        margin="10px"> 
                                        { errorMessage } 
                                        </FormErrorMessage>
                                    }
                                </FormControl>
                            </Box>
                        </form>
                    </Box>
                </Flex>
            </Box>
        </Flex>
    )
}