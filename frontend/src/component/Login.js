import React, { useEffect, useState } from "react";
import {
  TextField,
  FormControl,
  Button,
  Container,
  Box,
  Avatar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LockOutlined } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import axios from "axios";

const styles = makeStyles({
  login_box: {
    marginTop: "20%",
    marginRight: "10%",
    marginLeft: "10%",
    marginBottom: "10%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "0 solid #DFDCDC",
    borderTopWidth: "0.1px",
    borderLeftWidth: "0.1px",
    borderRadius: "10px 10px 10px 10px",
    paddingBottom: "20px",
    paddingRight: "10px",
    paddingLeft: "10px",
    paddingTop: "40px",
    WebkitBoxShadow: "27px 43px 43px -20px rgba(89,89,89,0.39)",
  },
});

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const classes = styles();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    if (id === "") {
      return alert("아이디를 입력해주세요.");
    } else if (password === "") {
      return alert("비밀번호를 입력해주세요.");
    }

    let body = {
      id: id,
      password: password,
    };

    const res = await axios.post("http://localhost:8080/login", body);
    if (!res.data) {
      return alert("로그인중 오류가 발생했습니다.");
    } else if (res.data === "비밀번호를 잘못 입력했습니다.") {
      return alert(res.data);
    } else if (res.data === "아이디를 잘못 입력했습니다.") {
      return alert(res.data);
    }
    sessionStorage.setItem(
      "key",
      JSON.stringify({
        tok: res.data.token,
      })
    );
    return navigate("/");
  }

  return (
    <>
      <Container component={"main"} maxWidth="md">
        <Box className={classes.login_box}>
          <Avatar
            sx={{
              m: 1,
              bgcolor: "#2E3B55",
              width: 60,
              height: 60,
            }}
          >
            <LockOutlined />
          </Avatar>
          <Typography sx={{ mb: 2, fontSize: "25px" }}>로그인</Typography>
          <FormControl>
            <TextField
              label="아이디"
              name="id"
              margin="normal"
              required
              autoFocus
              size="small"
              value={id}
              onChange={(e) => {
                setId(e.target.value);
              }}
            />
            <TextField
              label="비밀번호"
              name="password"
              margin="normal"
              type="password"
              required
              size="small"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <Button
              type="submit"
              variant="outlined"
              sx={{ mt: 3, mb: 3, p: 2 }}
              onClick={onSubmit}
            >
              로그인
            </Button>
          </FormControl>
        </Box>
      </Container>
    </>
  );
}

export default Login;
