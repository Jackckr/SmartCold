package filter;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by qiangzi on 2017/9/20.
 */
public class CompanyFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request= (HttpServletRequest) servletRequest;
        HttpServletResponse response= (HttpServletResponse) servletResponse;
        String requestURL = request.getRequestURL().toString();
        int yili = requestURL.indexOf("yl");
        int sx = requestURL.indexOf("sx");
        if (yili>=0){
            System.out.println(requestURL);
            response.sendRedirect("http://m.cold360.cn/yili.html");
        }else if(sx>=0){
            System.out.println(requestURL);
            response.sendRedirect("http://m.cold360.cn/sx.html");
        }else {
            filterChain.doFilter(servletRequest,servletResponse);
        }
    }

    @Override
    public void destroy() {

    }
}
