
#你好

 	white
        {
            if( WaitForSingleObject(g_eventTerminateService.m_hObject, 0) == WAIT_OBJECT_0 )
            // 结束GSoap服务线程
            {
                break;
            }
            int s = soap_accept(&soap);
            if( !soap_valid_socket(s) )
            {
                if( soap.errnum )
                {
                    soap_print_fault(&soap, stderr);
                    soap_done(&soap); // close master socket and detach environment
                    exit(1);
                }
                strOutput.Format(_T("\nGSoapServiceThreadFunc——等待客户端连接超时！"));
                OutputDebugString(strOutput);
            }
            else
            {
                struct soap* tsoap = soap_copy(&soap); // make a safe copy
                if( !tsoap )
                {
                    break;
                }
                AfxBeginThread(process_request, tsoap);
            }
        }

#### 实现请求处理线程

相应代码

        /// GSoap请求处理线程
        UINT process_request(LPVOID soap)
        {
            CoInitialize(NULL);

            soap_serve((struct soap*)soap);         // 会自动调用具体的接口函数
            soap_destroy((struct soap*)soap);       // dealloc C++ data
            soap_end((struct soap*)soap);           // dealloc data and clean up
            soap_done((struct soap*)soap);          // detach soap struct
            free(soap);

            CoUninitialize();

            return 0;
        }

#### 实现接口功能函数

* 在代码中定义相应的接口功能函数

        int __ns1__AddOperation(struct soap*, int A, int B, int &result)
        {
            result = A + B;
            return SOAP_OK;
        }





