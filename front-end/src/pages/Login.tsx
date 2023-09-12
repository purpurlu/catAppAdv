import { useContext, useEffect, useState } from "react"
import { login } from "../helpers/utils"
import { useNavigate } from "react-router-dom"
import "../components/signUp.css"
import { AuthContext } from "../context/Context"
import { Button, ButtonGroup, Input, Box, Text, FormControl, FormErrorMessage } from '@chakra-ui/react'


export const Login = ():React.JSX.Element => {
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState<string>("")

    const { isLoggedIn } = useContext(AuthContext)

    useEffect(() => {
        if(isLoggedIn) {
            navigate("/")
        }
    }, [isLoggedIn])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        const username = data.get('username')?.toString()
        const password = data.get('password')?.toString()
        console.log(data.get("username"))

        const res = await login(username!, password!)
        if (res.success) {
            setErrorMessage("")
            // console.log(await checkAuth())
            // alert("Success!")
            navigate("/")
        } else {
            setErrorMessage(res.errorMessage!)
        }
    }

    return (
        <Box w="100%" className="signup">
            <Text fontSize={"large"} fontWeight={"bold"}> Login Page </Text>
            <Box margin={"auto"} w='50%' maxW='50%' p={4} color='white'>
                <form onSubmit={handleSubmit}>
                    <FormControl isInvalid={errorMessage ? true : false}>
                        <Input required type="text" name="username" placeholder="Username" size='sm'/>
                        <Input required type='password' name="password" placeholder="Password" size='sm'/>
                        <ButtonGroup>
                            <Button type="reset"> Reset </Button>
                            <Button type="submit" > Login </Button>
                        </ButtonGroup>
                        {
                            errorMessage && 
                            <FormErrorMessage color="black"> { errorMessage } </FormErrorMessage>
                        }
                    </FormControl>

                </form>

            </Box>

        </Box>
    )
}